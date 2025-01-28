const router = require('express').Router();
const Book = require('../models/Book');

router.get('/', async (req, res) => {
  try {
    const totalBooks = await Book.countDocuments();
    const pendingApprovals = await Book.countDocuments({ isApproved: false });
    const uniqueUploaders = await Book.distinct('uploader').length;
    
    const booksByGenre = await Book.aggregate([
      {
        $group: {
          _id: '$genre',
          count: { $sum: 1 }
        }
      }
    ]);

    const currentYear = new Date().getFullYear();
    const monthlyActivity = await Promise.all([
      Book.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(currentYear, 0, 1),
              $lt: new Date(currentYear + 1, 0, 1)
            }
          }
        },
        {
          $group: {
            _id: { $month: "$createdAt" },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]),
      Book.aggregate([
        {
          $match: {
            isApproved: true,
            createdAt: {
              $gte: new Date(currentYear, 0, 1),
              $lt: new Date(currentYear + 1, 0, 1)
            }
          }
        },
        {
          $group: {
            _id: { $month: "$createdAt" },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ])
    ]);

    const uploads = new Array(12).fill(0);
    const approvals = new Array(12).fill(0);

    monthlyActivity[0].forEach(item => uploads[item._id - 1] = item.count);
    monthlyActivity[1].forEach(item => approvals[item._id - 1] = item.count);

    res.json({
      totalBooks,
      pendingApprovals,
      uniqueUploaders,
      booksByGenre: Object.fromEntries(
        booksByGenre.map(({ _id, count }) => [_id, count])
      ),
      monthlyActivity: {
        uploads,
        approvals
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
