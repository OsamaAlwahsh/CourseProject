const express = require('express');
const router = express.Router();
const Lesson = require('../models/Lesson');

/**
 * @swagger
 * tags:
 *   name: Lessons
 *   description: Course lesson management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Lesson:
 *       type: object
 *       required:
 *         - title
 *         - course
 *       properties:
 *         title:
 *           type: string
 *           example: "Introduction to Express"
 *         description:
 *           type: string
 *           example: "Learn Express basics"
 *         content:
 *           type: string
 *           example: "Detailed lesson content..."
 *         course:
 *           type: string
 *           format: objectId
 *           example: "60d21b4667d0d8992e610c86"
 */

/**
 * @swagger
 * /api/lessons:
 *   post:
 *     summary: Create a new lesson
 *     tags: [Lessons]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Lesson'
 *     responses:
 *       201:
 *         description: Lesson created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Lesson'
 *       400:
 *         description: Bad request (missing required fields)
 *       500:
 *         description: Server error
 */
router.post('/', async (req, res) => {
    const lesson = new Lesson(req.body);
    await lesson.save();
    res.status(201).json(lesson);
});

/**
 * @swagger
 * /api/lessons:
 *   get:
 *     summary: Get all lessons with optional filtering
 *     tags: [Lessons]
 *     parameters:
 *       - in: query
 *         name: course
 *         schema:
 *           type: string
 *         description: Filter by course ID
 *     responses:
 *       200:
 *         description: List of lessons
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Lesson'
 *       500:
 *         description: Server error
 */
router.get('/', async (req, res) => {
    const { course } = req.query;
    const query = {};
    if (course) query.course = course;

    const lessons = await Lesson.find(query).populate('course');
    res.json(lessons);
});

/**
 * @swagger
 * /api/lessons/{id}:
 *   put:
 *     summary: Update a lesson
 *     tags: [Lessons]
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
 *             $ref: '#/components/schemas/Lesson'
 *     responses:
 *       200:
 *         description: Updated lesson
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Lesson'
 *       404:
 *         description: Lesson not found
 *       500:
 *         description: Server error
 */
router.put('/:id', async (req, res) => {
    const lesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(lesson);
});

/**
 * @swagger
 * /api/lessons/{id}:
 *   delete:
 *     summary: Delete a lesson
 *     tags: [Lessons]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lesson deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Lesson deleted"
 *       404:
 *         description: Lesson not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', async (req, res) => {
    await Lesson.findByIdAndDelete(req.params.id);
    res.json({ message: 'Lesson deleted' });
});

module.exports = router;