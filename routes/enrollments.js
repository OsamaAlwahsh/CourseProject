const express = require('express');
const router = express.Router();
const Enrollment = require('../models/Enrollment');

/**
 * @swagger
 * tags:
 *   name: Enrollments
 *   description: Course enrollment management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Enrollment:
 *       type: object
 *       required:
 *         - student
 *         - course
 *       properties:
 *         student:
 *           type: string
 *           format: objectId
 *           example: "60d21b4667d0d8992e610c85"
 *         course:
 *           type: string
 *           format: objectId
 *           example: "60d21b4667d0d8992e610c86"
 *         enrollmentDate:
 *           type: string
 *           format: date-time
 *           example: "2023-06-01T00:00:00Z"
 */

/**
 * @swagger
 * /enrollments:
 *   post:
 *     summary: Create a new enrollment
 *     tags: [Enrollments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Enrollment'
 *     responses:
 *       201:
 *         description: Enrollment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Enrollment'
 *       400:
 *         description: Bad request (missing required fields)
 *       500:
 *         description: Server error
 */
router.post('/', async (req, res) => {
    const enrollment = new Enrollment(req.body);
    await enrollment.save();
    res.status(201).json(enrollment);
});

/**
 * @swagger
 * /enrollments:
 *   get:
 *     summary: Get all enrollments with optional filtering
 *     tags: [Enrollments]
 *     parameters:
 *       - in: query
 *         name: student
 *         schema:
 *           type: string
 *         description: Filter by student ID
 *       - in: query
 *         name: course
 *         schema:
 *           type: string
 *         description: Filter by course ID
 *     responses:
 *       200:
 *         description: List of enrollments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Enrollment'
 *       500:
 *         description: Server error
 */
router.get('/', async (req, res) => {
    const { student, course } = req.query;
    const query = {};
    if (student) query.student = student;
    if (course) query.course = course;

    const enrollments = await Enrollment.find(query)
        .populate('student')
        .populate('course');
    
    res.json(enrollments);
});

/**
 * @swagger
 * /enrollments/{id}:
 *   put:
 *     summary: Update an enrollment
 *     tags: [Enrollments]
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
 *             $ref: '#/components/schemas/Enrollment'
 *     responses:
 *       200:
 *         description: Updated enrollment
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Enrollment'
 *       404:
 *         description: Enrollment not found
 *       500:
 *         description: Server error
 */
router.put('/:id', async (req, res) => {
    const enrollment = await Enrollment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(enrollment);
});

/**
 * @swagger
 * /enrollments/{id}:
 *   delete:
 *     summary: Delete an enrollment
 *     tags: [Enrollments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Enrollment deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Enrollment deleted"
 *       404:
 *         description: Enrollment not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', async (req, res) => {
    await Enrollment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Enrollment deleted' });
});

module.exports = router;