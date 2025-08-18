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
      (p) => p?._id === program_id && p?.program_asign_id === program_asign_id
    );

    if (!program) {
      return {
        data: null,
        message: "Program not found",
        status: 404,
      };
    }

    const session = (program?.session_list || [])?.find(
      (s) => s?._id === session_id
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
        exercise_list: session?.exercise_list?.map((block_exercise) => {
          if (block_exercise.is_block) {
            return {
              _id: block_exercise?._id,
              name: block_exercise?.name,
              is_block: true,
              is_superset: false,
              is_completed: block_exercise?.is_completed,
              exercise_list: block_exercise?.exercise_list?.map(
                (superset_exercise) => {
                  if (superset_exercise.is_superset) {
                    return {
                      _id: superset_exercise?._id,
                      is_block: false,
                      is_superset: true,
                      is_completed: superset_exercise?.is_completed,
                      exercise_list: superset_exercise?.exercise_list?.map(
                        (exercise) => {
                          return {
                            _id: exercise?._id,
                            name: exercise?.name,
                            is_block: false,
                            is_superset: false,
                            image: exercise?.image,
                            set_list: (exercise?.set_list || [])?.map(
                              (set) => set?._id
                            ),
                            is_completed: exercise?.is_completed,
                          };
                        }
                      ),
                    };
                  } else {
                    return {
                      _id: superset_exercise?._id,
                      name: superset_exercise?.name,
                      is_block: false,
                      is_superset: false,
                      image: superset_exercise?.image,
                      set_list: (superset_exercise?.set_list || [])?.map(
                        (set) => set?._id
                      ),
                      is_completed: superset_exercise?.is_completed,
                    };
                  }
                }
              ),
            };
          } else {
            return {
              _id: block_exercise?._id,
              name: block_exercise?.name,
              is_superset: false,
              is_block: false,
              image: block_exercise?.image,
              set_list: (block_exercise?.set_list || [])?.map(
                (set) => set?._id
              ),
              is_completed: block_exercise?.is_completed,
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
