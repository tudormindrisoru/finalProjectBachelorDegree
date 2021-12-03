const router = require('express').Router();

router.post('/interval', verifyToken, async (req, res) => {
    try {
        const { error } = workingHoursIntervalValidation(req.body);
        if(error) {
            res.status(406).send(error.details[0].message);
            return;
        }
        const decryptedToken = decryptID(req.header('auth-token'));
        const intervals = await WorkingHoursInterval.find({ doctorID: decryptedToken._id,  dayOfWeek: req.body.dayOfWeek });
        for(let interval of intervals) {
            if (
              (interval.start <= req.body.start &&
                interval.end >= req.body.start) ||
              (interval.start >= req.body.start &&
                interval.end >= req.body.end) ||
              (interval.start <= req.body.start &&
                interval.end <= req.body.end) ||
              (interval.start < req.body.start && interval.end < req.body.end)
            ) {
                res.status(406).send("Intervals overflow.");
                return;
            }
        }
        const workingInterval = new WorkingHoursInterval({
            doctorID: decryptedToken._id,
            dayOfWeek: req.body.dayOfWeek,
            start: req.body.start,
            end: req.body.end
        });
        const savingInterval = await workingInterval.save();

        console.log(savingInterval);
        delete savingInterval._doc.doctorID;
        res.status(200).send(savingInterval);
    } catch(error) {
        console.error(new Error(error));
        res.status(400).send(error);
    }
});

router.put('/interval', verifyToken, async (req, res) => {
    try {

        const { error } = workingHoursIntervalValidation(req.body);
        if(error) {
            res.status(406).send(error.details[0].message);
            return;
        }
        if(!req.query.id) {
            res.status(406).send("Query 'id' missing from request.");
            return;
        }
        
        const decryptedToken = decryptID(req.header('auth-token'));
        const intervals = await WorkingHoursInterval.find({ doctorID: decryptedToken._id,  dayOfWeek: req.body.dayOfWeek });
        console.log(intervals);
        let selectedInterval = intervals.find(function(interval) {
            console.log(interval._doc._id, req.query); 
            if(interval._doc._id.equals(req.query.id)) {
                return interval._doc;
            }
            else return undefined;
        });
        
        console.log("selected interval ", selectedInterval);

        if(!selectedInterval) {
            res.status(404).send("The interval was not found.");
            return;
        }

        for(let interval of intervals) {
            if(interval._id !== selectedInterval._id) {
                if (
                  (interval.start <= req.body.start &&
                    interval.end >= req.body.start) ||
                  (interval.start >= req.body.start &&
                    interval.end >= req.body.end) ||
                  (interval.start <= req.body.start &&
                    interval.end <= req.body.end) ||
                  (interval.start < req.body.start && interval.end < req.body.end)
                ) {
                    res.status(406).send("Intervals overflow error.");
                    return;
                }
            }
        }
    
        const updatedInterval = await WorkingHoursInterval.updateOne({ _id: selectedInterval._doc._id }, { $set: { start: req.body.start, end: req.body.end }});
        if(updatedInterval.ok === 1) {
            const result = {
                _id: selectedInterval._doc._id,
                dayOfWeek: selectedInterval._doc.dayOfWeek,
                start: req.body.start,
                end: req.body.end
            }
            res.status(200).send(result);
        } else {
            res.status(400).send("Something went wrong. The interval could not be updated.");
        }
        console.log(updatedInterval);
    } catch(error) {
        console.error(new Error(error));
        res.status(400).send(error);
    }
});

router.delete('/interval', verifyToken, async (req, res) => {
    try {
        if(!req.query.id) {
            res.status(406).send("Query 'id' missing from request.");
            return;
        }
        const decryptedToken = decryptID(req.header('auth-token'));
        const deleteInterval = await WorkingHoursInterval.deleteOne({_id: req.query.id, doctorID: decryptedToken._id });
        console.log(deleteInterval);
        if(deleteInterval.ok === 1 && deleteInterval.deletedCount === 1) {
            res.status(200).send("Schedule interval deleted successfully!");
        } else {
            res.status(400).send("Something bad happen! The interval could not be deleted!");
        }
    } catch(error) {
        console.error(new Error(error));
        res.status(400).send(error);
    }
});

module.exports = router;