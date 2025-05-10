const express = require('express');
const router = express.Router();
const Submission = require('../models/Submission');

/**
 * @swagger
 * tags:
 *   name: Submissions
 *   description: Quiz submission management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Submission:
 *       type: object
 *       required:
 *         - student
 *         - quiz
 *       properties:
 *         student:
 *           type: string
 *           format: objectId
 *           example: "60d21b4667d0d8992e610c85"
 *         quiz:
 *           type: string
 *           format: objectId
 *           example: "60d21b4667d0d8992e610c87"
 *         answers:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               questionId:
 *                 type: string
 *               answer:
 *                 type: string
 *         score:
 *           type: number
 *           example: 85
 *         submittedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/submissions:
 *   post:
 *     summary: Create a new submission
 *     tags: [Submissions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Submission'
 *     responses:
 *       201:
 *         description: Submission created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Submission'
 *       400:
 *         description: Bad request (missing required fields)
 *       500:
 *         description: Server error
 */
router.post('/', async (req, res) => {
    const submission = new Submission(req.body);
    await submission.save();
    res.status(201).json(submission);
});

/**
 * @swagger
 * /api/submissions:
 *   get:
 *     summary: Get all submissions with optional filtering
 *     tags: [Submissions]
 *     parameters:
 *       - in: query
 *         name: student
 *         schema:
 *           type: string
 *         description: Filter by student ID
 *       - in: query
 *         name: quiz
 *         schema:
 *           type: string
 *         description: Filter by quiz ID
 *     responses:
 *       200:
 *         description: List of submissions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Submission'
 *       500:
 *         description: Server error
 */
router.get('/', async (req, res) => {
    const { student, quiz } = req.query;
    const query = {};
    if (student) query.student = student;
    if (quiz) query.quiz = quiz;

    const submissions = await Submission.find(query)
        .populate('student')
        .populate('quiz');
    
    res.json(submissions);
});

/**
 * @swagger
 * /api/submissions/{id}:
 *   put:
 *     summary: Update a submission
 *     tags: [Submissions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Submission'
 *     responses:
 *       200:
 *         description: Updated submission
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Submission'
 *       404:
 *         description: Submission not found
 *       500:
 *         description: Server error
 */
router.put('/:id', async (req, res) => {
    const submission = await Submission.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(submission);
});

/**
 * @swagger
 * /api/submissions/{id}:
 *   delete:
 *     summary: Delete a submission
 *     tags: [Submissions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Submission deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Submission deleted"
 *       404:
 *         description: Submission not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', async (req, res) => {
    await Submission.findByIdAndDelete(req.params.id);
    res.json({ message: 'Submission deleted' });
});

module.exports = router;