const courses = [
  {
    subject: 'Mathematics',
    level: 'Matric & Intermediate',
    lessons: '120+ Lessons',
    color: 'from-planet-600 to-planet-800',
    lightColor: 'bg-planet-100',
  },
  {
    subject: 'Physics',
    level: 'Matric & Intermediate',
    lessons: '90+ Lessons',
    color: 'from-planet-500 to-planet-700',
    lightColor: 'bg-planet-50',
  },
  {
    subject: 'Chemistry',
    level: 'Matric & Intermediate',
    lessons: '100+ Lessons',
    color: 'from-planet-600 to-planet-900',
    lightColor: 'bg-planet-100',
  },
  {
    subject: 'Biology',
    level: 'Matric & Intermediate',
    lessons: '85+ Lessons',
    color: 'from-planet-500 to-planet-700',
    lightColor: 'bg-planet-50',
  },
  {
    subject: 'English',
    level: 'All Levels',
    lessons: '70+ Lessons',
    color: 'from-planet-600 to-planet-800',
    lightColor: 'bg-planet-100',
  },
  {
    subject: 'Urdu',
    level: 'All Levels',
    lessons: '60+ Lessons',
    color: 'from-planet-500 to-planet-700',
    lightColor: 'bg-planet-50',
  },
  {
    subject: 'Computer Science',
    level: 'Intermediate',
    lessons: '75+ Lessons',
    color: 'from-planet-600 to-planet-900',
    lightColor: 'bg-planet-100',
  },
  {
    subject: 'Pakistan Studies',
    level: 'Matric & Intermediate',
    lessons: '50+ Lessons',
    color: 'from-planet-500 to-planet-700',
    lightColor: 'bg-planet-50',
  },
]

export default function Courses() {
  return (
    <section id="courses" className="py-24 bg-planet-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-planet-900 mb-4">
            Explore Our Courses
          </h2>
          <p className="text-planet-600 text-lg">
            Comprehensive coverage of all subjects from Matric to Intermediate level,
            designed according to Pakistani education boards.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map((course) => (
            <div
              key={course.subject}
              className="group bg-white rounded-2xl overflow-hidden border border-planet-100 hover:border-planet-300 transition-all hover:shadow-xl cursor-pointer"
            >
              <div className={`h-2 bg-gradient-to-r ${course.color}`} />
              <div className="p-6">
                <div className={`w-12 h-12 ${course.lightColor} rounded-xl flex items-center justify-center mb-4`}>
                  <span className="text-planet-700 font-bold text-lg">
                    {course.subject[0]}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-planet-900 mb-1">
                  {course.subject}
                </h3>
                <p className="text-sm text-planet-500 mb-3">{course.level}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-planet-600 bg-planet-50 px-3 py-1 rounded-full">
                    {course.lessons}
                  </span>
                  <svg className="w-5 h-5 text-planet-400 group-hover:text-planet-600 transition-colors" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
