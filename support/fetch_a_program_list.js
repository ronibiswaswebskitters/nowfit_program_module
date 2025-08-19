import fs from "fs/promises";

export const fetch_program_list = async () => {
  try {
    const data = await fs.readFile("workout_database.json", "utf-8");

    const jsonData = JSON.parse(data);
    const programList = jsonData?.map((item) => {
      return {
        program_id: item?.program_id,
        program_asign_id: item?.program_asign_id,
        program_name: item?.program_name,
        program_image: item?.program_image,
        is_completed: item?.is_completed,
        session_list: item?.session_list?.map((session) => ({
          session_id: session?.session_id,
          assign_date: session?.assign_date,
        })),
      };
    });

    return {
      data: programList,
      message: "Program list fetched successfully!!",
      status: 200,
    };
  } catch (err) {
    console.error("Error reading program list:", err);
    return {
      data: [],
      message: "Could not read program list!!",
      status: 500,
    };
  }
};
