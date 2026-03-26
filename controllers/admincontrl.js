exports.getMonthlyStats = async (req,res)=>{
 const stats = await User.aggregate([
  {
    $match:{
      lastLogin:{
        $gte:new Date(Date.now()-30*24*60*60*1000)
      }
    }
  },
  {
    $group:{
      _id:"$role",
      total:{$sum:1}
    }
  }
 ]);

 res.json(stats);
};