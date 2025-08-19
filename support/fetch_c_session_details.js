import fs from "fs/promises";

export const fetch_session_details = async (
  program_id,
  program_asign_id,
  session_id,
  full_details
) => {
  try {
    const data = await fs.readFile("workout_database.json", "utf-8");
    const programList = JSON.parse(data);

    const program = programList?.find(
      (p) =>
        p?.program_id === program_id && p?.program_asign_id === program_asign_id
    );

    if (!program) {
      return {
        data: null,
        message: "Program not found",
        status: 404,
      };
    }

    const session = (program?.session_list || [])?.find(
      (s) => s?.session_id === session_id
    );

    if (!session) {
      return {
        data: null,
        message: "Session not found",
        status: 404,
      };
    }

    if (full_details) {
      return {
        data: session,
        message: "Session details fetched successfully",
        status: 200,
      };
    } else {
      const formattedSession = {
        ...session,
        exercise_list: session?.exercise_list?.map((bl_ss_ex) => {
          if (bl_ss_ex.is_block) {
            return {
              block_id: bl_ss_ex?.block_id,
              name: bl_ss_ex?.name,
              is_block: true,
              is_superset: false,
              is_completed: bl_ss_ex?.is_completed,
              exercise_list: bl_ss_ex?.exercise_list?.map((ss_ex) => {
                if (ss_ex.is_superset) {
                  return {
                    superset_id: ss_ex?.superset_id,
                    is_block: false,
                    is_superset: true,
                    is_completed: ss_ex?.is_completed,
                    exercise_list: ss_ex?.exercise_list?.map((ex) => {
                      return {
                        exercise_id: ex?.exercise_id,
                        name: ex?.name,
                        is_block: false,
                        is_superset: false,
                        image: ex?.image,
                        set_list: (ex?.set_list || [])?.map(
                          (set) => set?.set_id
                        ),
                        is_completed: ex?.is_completed,
                      };
                    }),
                  };
                } else {
                  return {
                    exercise_id: ss_ex?.exercise_id,
                    name: ss_ex?.exercise_name,
                    is_block: false,
                    is_superset: false,
                    image: ss_ex?.exercise_image,
                    set_list: (ss_ex?.set_list || [])?.map(
                      (set) => set?.set_id
                    ),
                    is_completed: ss_ex?.is_completed,
                  };
                }
              }),
            };
          } else if (bl_ss_ex?.is_superset) {
            return {
              superset_id: bl_ss_ex?.superset_id,
              is_block: false,
              is_superset: true,
              is_completed: bl_ss_ex?.is_completed,
              exercise_list: bl_ss_ex?.exercise_list?.map((ex) => {
                return {
                  exercise_id: ex?.exercise_id,
                  name: ex?.name,
                  is_block: false,
                  is_superset: false,
                  image: ex?.image,
                  set_list: (ex?.set_list || [])?.map((set) => set?.set_id),
                  is_completed: ex?.is_completed,
                };
              }),
            };
          } else {
            return {
              exercise_id: bl_ss_ex?.exercise_id,
              name: bl_ss_ex?.name,
              is_superset: false,
              is_block: false,
              image: bl_ss_ex?.image,
              set_list: (bl_ss_ex?.set_list || [])?.map((set) => set?.set_id),
              is_completed: bl_ss_ex?.is_completed,
            };
          }
        }),
      };

      return {
        data: formattedSession,
        message: "Session details fetched successfully",
        status: 200,
      };
    }
  } catch (err) {
    console?.error("Error reading session details:", err);
    return {
      data: null,
      message: "Could not read session details",
      status: 500,
    };
  }
};
