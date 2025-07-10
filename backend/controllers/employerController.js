const Job = require('../models/Job');
const Application = require('../models/Application');
const Blog = require('../models/Blog');


exports.getEmployerStats = async (req, res) => {
  try {
    const employerId = req.user.userId;


    // JOB STATS
    const jobs = await Job.find({ employer: employerId });
    const totalJobs = jobs.length;
    const activeJobs = jobs.filter(j => j.isActive).length;
    const inactiveJobs = totalJobs - activeJobs;


    const jobsByCountry = jobs.reduce((acc, job) => {
      acc[job.location] = (acc[job.location] || 0) + 1;
      return acc;
    }, {});


    // APPLICATION STATS
    const applications = await Application.find({ job: { $in: jobs.map(j => j._id) } });
    const totalApplicants = applications.length;


    const statusCount = applications.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    }, {});


    const applicantsPerJob = jobs.map(job => ({
      jobTitle: job.title,
      count: applications.filter(app => app.job.toString() === job._id.toString()).length
    }));


    // BLOG STATS
    const blogs = await Blog.find({ employer: employerId });
    const totalBlogs = blogs.length;
    const totalLikes = blogs.reduce((acc, blog) => acc + blog.likes.length, 0);
    const totalComments = blogs.reduce((acc, blog) => acc + blog.comments.length, 0);


    res.status(200).json({
      jobs: {
        total: totalJobs,
        active: activeJobs,
        inactive: inactiveJobs,
        byCountry: jobsByCountry
      },
      applicants: {
        total: totalApplicants,
        status: statusCount,
        perJob: applicantsPerJob
      },
      blogs: {
        total: totalBlogs,
        likes: totalLikes,
        comments: totalComments
      }
    });


  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch analytics' });
  }
};
