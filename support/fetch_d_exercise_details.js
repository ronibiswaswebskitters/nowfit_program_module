import fs from "fs/promises";

export const fetch_exercise_details = async (
  program_id,
  program_asign_id,
  session_id,
  exercise_id
) => {
  try {
    const data = await fs.readFile("workout_database.json", "utf-8");
    const programList = JSON.parse(data);

    const program = programList.find(
      (p) =>
        p.program_id === program_id && p.program_asign_id === program_asign_id
    );

    if (!program) {
      return {
        data: null,
        message: "Program not found",
        status: 404,
      };
    }

    const session = (program.session_list || []).find(
      (s) => s.session_id === session_id
    );

    if (!session) {
      return {
        data: null,
        message: "Session not found",
        status: 404,
      };
    }
    let exercise = null;

    for (const item of session.exercise_list || []) {
      if (item?.exercise_id === exercise_id) {
        exercise = item;
        break;
      }
      if (item?.is_block) {
        const found = (item.exercise_list || []).find(
          (ex) => ex.exercise_id === exercise_id
        );
        if (found) {
          exercise = found;
          break;
        }
      }
    }

    if (!exercise) {
      return {
        data: null,
        message: "Exercise not found",
        status: 404,
      };
    }

    return {
      data: exercise,
      message: "Exercise details fetched successfully",
      status: 200,
    };
  } catch (err) {
    console.error("Error reading exercise details:", err);
    return {
      data: null,
      message: "Could not read exercise details",
      status: 500,
    };
  }
};
