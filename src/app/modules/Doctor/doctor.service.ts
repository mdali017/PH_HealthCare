import prisma from "../../../shared/prisma";

const updatedoctorDataIntoDB = async (id: string, payload: any) => {
  const { specialties, ...doctorData } = payload;

  // console.log(doctorData);
  // console.log(specialties);

  const doctorInfo = await prisma.doctor.findUniqueOrThrow({
    where: {
      id,
    },
  });

  await prisma.$transaction(async (transactionClient) => {
    const updateDoctorData = await transactionClient.doctor.update({
      where: {
        id,
      },
      data: doctorData,
      // include: {
      //   doctorSpecialties: true,
      // },
    });

    if (specialties && specialties.length > 0) {
      const deleteSpecialtiesIds = specialties.filter(
        (specialty: { isDeleted: any }) => specialty.isDeleted
      );

      for (const specialtyId of deleteSpecialtiesIds) {
        await transactionClient.doctorSpecialties.deleteMany({
          where: {
            doctorId: doctorInfo.id,
            specialtiesId: specialtyId,
          },
        });
      }

      // for create specialties
      const createSpecialtiesIds = specialties.filter(
        (specialty: { isDeleted: any }) => !specialty.isDeleted
      );
      for (const specialty of createSpecialtiesIds) {
        await transactionClient.doctorSpecialties.create({
          data: {
            doctorId: doctorInfo.id,
            specialtiesId: specialty,
          },
        });
      }
    }

    for (const specialtiesId of specialties) {
      const createDoctorSpecialties =
        await transactionClient.doctorSpecialties.create({
          data: {
            doctorId: updateDoctorData.id,
            specialtiesId: specialtiesId,
          },
        });
    }

    return updateDoctorData;
  });
};

export const DoctorService = {
  updatedoctorDataIntoDB,
};
