import fs from "fs/promises";

export const update_session_details = async (
  type,
  program_id,
  program_asign_id,
  session_id,
  session_details
) => {
  try {
    const new_session_details = {
      ...session_details,
      exercise_list: session_details?.exercise_list?.map(
        (block_exercise, _) => {
          if (block_exercise.is_block) {
            return {
              ...block_exercise,
              exercise_list: block_exercise?.exercise_list?.map(
                (exercise, __) => {
                  return {
                    ...exercise,
                    set_list: exercise?.set_list?.map((set, __) => ({
                      ...set,
                      _id:
                        set?._id ||
                        Date.now().toString(36) +
                          Math.random().toString(36).substr(2, 5),
                    })),
                  };
                }
              ),
            };
          } else {
            return {
              ...block_exercise,
              set_list: block_exercise?.set_list?.map((set, __) => ({
                ...set,
                _id:
                  set?._id ||
                  Date.now().toString(36) +
                    Math.random().toString(36).substr(2, 5),
              })),
            };
          }
        }
      ),
    };

    const data = await fs.readFile("workout_database.json", "utf-8");
    const programList = JSON.parse(data);

    const programIndex = programList?.findIndex(
      (program) =>
        program?._id === program_id &&
        program_asign_id === program?.program_asign_id
    );

    if (programIndex === -1) {
      return {
        data: null,
        message: "Program not found",
        status: 404,
      };
    }

    const sessionIndex = programList[programIndex]?.session_list?.findIndex(
      (s) => s?._id === session_id
    );

    if (sessionIndex === -1) {
      return {
        data: null,
        message: "Session not found",
        status: 404,
      };
    }

    programList[programIndex].session_list[sessionIndex] = {
      ...programList[programIndex].session_list[sessionIndex],
      ...new_session_details,
    };

    await fs.writeFile(
      "workout_database.json",
      JSON.stringify(programList, null, 2),
      "utf-8"
    );

    return {
      data: {},
      message: (type ?? "Session") + " details updated successfully",
      status: 200,
    };
  } catch (err) {
    console.error("Error updating session details:", err);
    return {
      data: null,
      message: "Could not update session details",
      status: 500,
    };
  }
};
