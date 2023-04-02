export default defineEventHandler(async (event) => {
  const courses = await event.context.cx.getCourseList()

  const exists = await event.context.prisma.course.findMany({
    where: {
      id: {
        in: courses.map(c => `${c.courseId}_${c.classId}`),
      },
      accounts: {
        some: {
          uid: event.context.cx.user.uid,
        },
      },
    },
  })

  const toCreate = courses.filter(c => !exists.some(e => e.id === `${c.courseId}_${c.classId}`))

  if (toCreate.length > 0) {
    await event.context.prisma.course.createMany({
      data: toCreate.map(c => ({
        id: `${c.courseId}_${c.classId}`,
        name: c.name,
        courseId: c.courseId,
        classId: c.classId,
        image: c.image,
        link: c.link,
      })),
      skipDuplicates: true,
    })
  }

  await event.context.prisma.cxAccount.update({
    where: {
      uid: event.context.cx.user.uid,
    },
    data: {
      courses: {
        set: courses.map(c => ({
          id: `${c.courseId}_${c.classId}`,
        })),
      },
    },
  })

  return ResOp.success(courses)
})
