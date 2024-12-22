import Rake from "../Models/form.model.js";
import Wagon from "../Models/wagon.js";
import axios from "axios";

// Assign wagons to different WTs
export const assignWagons = async (req, res) => {
  try {
    const { rakeNo, wt1, wt2, wt3, wt4 } = req.body;

    console.log(`Assigning wagons: ${JSON.stringify(req.body)}`);

    const rake = await Rake.findOne({ rakeNo });

    if (!rake) {
      console.log(`Rake not found: ${rakeNo}`);
      return res.status(404).json({ message: "Rake not found" });
    }

    const totalWagons = parseInt(rake.wagons);

    if (wt1 + wt2 + wt3 + wt4 !== totalWagons) {
      return res.status(400).json({ message: "Total wagons assigned to WTs must equal the total wagons in the rake" });
    }

    const existingAssignment = await Wagon.findOne({ rakeNo });

    if (existingAssignment) {
      return res.status(400).json({ message: "Wagons for this rake already assigned" });
    }

    const initialProgress = Array(9).fill().map((_, hour) => ({
      hour: hour + 1,
      completedWagons: 0,
      detectTime: null,
      systemStartTime: null,
      reasons: ''
    }));

    const assignment = await Wagon.create({
      rakeNo,
      wt1: { assignedWagons: wt1, progress: initialProgress },
      wt2: { assignedWagons: wt2, progress: initialProgress },
      wt3: { assignedWagons: wt3, progress: initialProgress },
      wt4: { assignedWagons: wt4, progress: initialProgress },
    });

    console.log(`Wagons assigned successfully: ${JSON.stringify(assignment)}`);

    res.status(201).json({
      success: true,
      message: "Wagons assigned successfully",
      assignment,
    });
  } catch (err) {
    console.error("Error assigning wagons:", err);
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
// Update hourly progress
export const updateHourlyProgress = async (req, res) => {
  try {
    const { rakeNo, wt, hour, completedWagons, detectTime, systemStartTime, reasons } = req.body;

    // Log the request payload
    console.log("Received payload:", req.body);

    // Validate request data
    if (!rakeNo || !wt || !hour || completedWagons === undefined) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const wagon = await Wagon.findOne({ rakeNo });
    if (!wagon) {
      return res.status(404).json({ success: false, message: 'Wagon not found' });
    }

    const wtField = `wt${wt}`;
    const wtData = wagon[wtField];
    const progress = wtData.progress.find(p => p.hour === hour);
    if (!progress) {
      return res.status(404).json({ success: false, message: 'Progress not found' });
    }

    // Calculate the total completed wagons excluding the current hour's progress
    const otherCompletedWagons = wtData.progress.reduce((total, p) => {
      if (p.hour !== hour) {
        return total + p.completedWagons;
      }
      return total;
    }, 0);

    const totalCompletedWagons = otherCompletedWagons + completedWagons;
    if (totalCompletedWagons > wtData.assignedWagons) {
      return res.status(400).json({
        success: false,
        message: `Total completed wagons (${totalCompletedWagons}) exceed assigned wagons (${wtData.assignedWagons}) for WT${wt}`
      });
    }

    // Update progress data
    progress.completedWagons = completedWagons;
    progress.detectTime = detectTime;
    progress.systemStartTime = systemStartTime;
    progress.reasons = reasons;

    await wagon.save();
    return res.status(200).json({ success: true, message: 'Progress updated successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};


// Get progress by rakeNo with time difference in hours
export const getProgressByRakeNo = async (req, res) => {
  try {
    const { rakeNo } = req.params;

    const assignment = await Wagon.findOne({ rakeNo });

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found for this rake" });
    }

    const assignmentWithTimeDifference = assignment.toObject();

    ['wt1', 'wt2', 'wt3', 'wt4'].forEach(wt => {
      if (assignmentWithTimeDifference[wt]) {
        assignmentWithTimeDifference[wt].progress.forEach(progress => {
          if (progress.detectTime && progress.systemStartTime) {
            const diffInMs = Math.abs(new Date(progress.detectTime) - new Date(progress.systemStartTime));
            progress.timeDifference = (diffInMs / (1000 * 60 * 60)).toFixed(2);
          } else {
            progress.timeDifference = null;
          }
        });
      }
    });

    console.log(`Progress fetched successfully for rake: ${rakeNo}`);

    res.status(200).json({
      success: true,
      assignment: assignmentWithTimeDifference,
    });
  } catch (err) {
    console.error("Error fetching progress:", err);
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

export const reasons = async(req,res) => {
  try {
    const assignments = await Wagon.find({});

    const reasonOccurrences = {};

    assignments.forEach(assignment => {
      ['wt1', 'wt2', 'wt3', 'wt4'].forEach(wt => {
        if (assignment[wt]) {
          assignment[wt].progress.forEach(progress => {
            const reason = progress.reasons;
            if (reason) {
              if (!reasonOccurrences[reason]) {
                reasonOccurrences[reason] = 0;
              }
              reasonOccurrences[reason]++;
            }
          });
        }
      });
    });

    res.status(200).json({
      success: true,
      reasonOccurrences,
    });
  } catch (err) {
    console.error("Error fetching reasons:", err);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
}




export const generateReport = async (req, res) => {
  try {
    const { rakeNo, releaseTime, railwayInputHours } = req.body;

    // Fetch the rake details
    const rake = await Rake.findOne({ rakeNo });
    if (!rake) {
      return res.status(404).json({ message: "Rake not found" });
    }

    // Fetch the assignment details
    const assignment = await Wagon.findOne({ rakeNo });
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found for this rake" });
    }

    // Fetch the progress details from the external API
    const progressResponse = await axios.get(`https://rakedetection.vercel.app/api/v3/wagon/getProgress/${rakeNo}`);

    // Log the response to see its structure
    console.log("Progress Response:", progressResponse.data);

    // Assume the data is structured as an object with an "assignment" object
    let assignmentData = progressResponse.data.assignment;

    // Sum the time differences in the progress arrays for each WT (wt1, wt2, etc.)
    const externalTotalDowntime = ['wt1', 'wt2', 'wt3', 'wt4'].reduce((total, wt) => {
      const wtData = assignmentData[wt];
      if (wtData && Array.isArray(wtData.progress)) {
        const wtDowntime = wtData.progress.reduce((sum, progress) => {
          const timeDiff = parseFloat(progress.timeDifference);
          return sum + (timeDiff && !isNaN(timeDiff) ? timeDiff : 0);
        }, 0);
        return total + wtDowntime;
      }
      return total;
    }, 0);

    // Calculate the placement time
    const placementTime = new Date(rake.placementDateTime);
    const releaseTimeDate = new Date(`${placementTime.toDateString()} ${releaseTime}`);

    // Calculate unloading hours in decimal hours
    const unloadingHours = (releaseTimeDate - placementTime) / (1000 * 60 * 60); // Convert from milliseconds to hours
    if (unloadingHours < 0) {
      return res.status(400).json({ message: "Release time cannot be earlier than placement time" });
    }

    // Calculate total downtime by summing timeDifference for each WT in the local assignment data
    const internalTotalDowntime = ['wt1', 'wt2', 'wt3', 'wt4'].reduce((total, wt) => {
      const wtData = assignment[wt];
      if (wtData && Array.isArray(wtData.progress)) {
        const wtDowntime = wtData.progress.reduce((sum, progress) => {
          const timeDiff = parseFloat(progress.timeDifference);
          return sum + (timeDiff && !isNaN(timeDiff) ? timeDiff : 0);
        }, 0);
        return total + wtDowntime;
      }
      return total;
    }, 0);

    // Combine internal and external downtime
    const totalDowntime = internalTotalDowntime + externalTotalDowntime;

    // Calculate detention hours in decimal hours
    const detentionHours = unloadingHours + totalDowntime;

    // Calculate demurrage hours in decimal hours
    const demurrageHours = detentionHours - railwayInputHours;

    // Helper function to convert decimal hours to hours and minutes
    const formatTime = (decimalHours) => {
      const hours = Math.floor(decimalHours);
      const minutes = Math.round((decimalHours - hours) * 60);
      return `${hours}h ${minutes}m`;
    };

    // Log the calculations (optional, for debugging)
    console.log(`Rake: ${rakeNo}, Unloading Hours: ${unloadingHours.toFixed(2)}, Total Downtime: ${totalDowntime.toFixed(2)}, Detention Hours: ${detentionHours.toFixed(2)}, Demurrage Hours: ${demurrageHours.toFixed(2)}`);

    // Respond with the generated report
    return res.status(200).json({
      success: true,
      report: {
        rakeNo,
        unloadingHours: formatTime(unloadingHours),
        totalDowntime: formatTime(totalDowntime),
        detentionHours: formatTime(detentionHours),
        demurrageHours: formatTime(demurrageHours),
      },
    });
  } catch (err) {
    console.error("Error generating report:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};




