import fs from "fs/promises";

export const fetch_program_details = async (program_id, program_asign_id) => {
  try {
    const data = await fs.readFile("workout_database.json", "utf-8");
    const programList = JSON.parse(data);

    const program = programList.find(
      (p) => p.program_id === program_id && p.program_asign_id === program_asign_id
    );

    if (!program) {
      return {
        data: null,
        message: "Program not found",
        status: 404,
      };
    }

    const session_list = (program.session_list || []).map((session) => ({
      session_id: session.session_id,
      assign_date: session.assign_date,
    }));

    program.session_list = session_list;

    return {
      data: program,
      message: "Program list fetched successfully",
      status: 200,
    };
  } catch (err) {
    console.error("Error reading program details:", err);
    return {
      data: null,
      message: "Could not read program details",
      status: 500,
    };
  }
};
