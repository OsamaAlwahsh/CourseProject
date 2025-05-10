const express = require('express');
const router = express.Router();
const Course = require('../models/Course');

/**
 * @swagger
 * tags:
 *   name: Courses
 *   description: Course management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Course:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           example: "Introduction to Node.js"
 *         description:
 *           type: string
 *           example: "Learn Node.js fundamentals"
 *         instructor:
 *           type: string
 *           format: objectId
 *           example: "60d21b4667d0d8992e610c85"
 *         lessons:
 *           type: array
 *           items:
 *             type: string
 *             format: objectId
 */

/**
 * @swagger
 * /api/courses:
 *   post:
 *     summary: Create a new course
 *     tags: [Courses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Course'
 *     responses:
 *       201:
 *         description: Course created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Course'
 *       500:
 *         description: Server error
 */
router.post('/', async (req, res) => {
    const course = new Course(req.body);
    await course.save();
    res.status(201).json(course);
});

/**
 * @swagger
 * /api/courses:
 *   get:
 *     summary: Get all courses with optional filtering
 *     tags: [Courses]
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Filter by course title (partial match)
 *       - in: query
 *         name: instructor
 *         schema:
 *           type: string
 *         description: Filter by instructor ID
 *     responses:
 *       200:
 *         description: List of courses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Course'
 *       500:
 *         description: Server error
 */
router.get('/', async (req, res) => {
    const { title, instructor } = req.query;
    const query = {};
    if (title) query.title = { $regex: title, $options: 'i' };
    if (instructor) query.instructor = instructor;

    const courses = await Course.find(query)
        .populate('instructor')
        .populate('lessons');
    
    res.json(courses);
});

/**
 * @swagger
 * /api/courses/{id}:
 *   put:
 *     summary: Update a course
 *     tags: [Courses]
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
 *             $ref: '#/components/schemas/Course'
 *     responses:
 *       200:
 *         description: Updated course
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Course'
 *       404:
 *         description: Course not found
 *       500:
 *         description: Server error
 */
router.put('/:id', async (req, res) => {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(course);
});

/**
 * @swagger
 * /api/courses/{id}:
 *   delete:
 *     summary: Delete a course
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Course deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Course deleted"
 *       404:
 *         description: Course not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', async (req, res) => {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: 'Course deleted' });
});

module.exports = router;