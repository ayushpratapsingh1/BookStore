router.get('/', async (req, res) => {
  try {
    const totalBooks = await Book.countDocuments();
    const pendingApprovals = await Book.countDocuments({ isApproved: false });
    const uniqueUploaders = await Book.distinct('uploader').length; // Add unique uploaders count
    
    const booksByGenre = await Book.aggregate([
      {
        $group: {
          _id: '$genre',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      totalBooks,
      pendingApprovals,
      uniqueUploaders,
      booksByGenre: Object.fromEntries(
        booksByGenre.map(({ _id, count }) => [_id, count])
      )
    });
  } catch (error) {
    // ...error handling...
  }
});
