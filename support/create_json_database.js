import fs from "fs/promises";

const audio_link =
  "https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3";
const program_image =
  "https://www.mensjournal.com/.image/t_share/MjA5MjM2NjAxMzI1MjMzNzc2/weight-loss-exercise-plan.jpg";
const session_image =
  "https://thumbs.dreamstime.com/b/closeup-portrait-muscular-man-workout-barbell-gym-brutal-bodybuilder-athletic-six-pack-perfect-abs-shoulders-55122231.jpg";
const exercise_image =
  "https://explosivewhey.com/cdn/shop/articles/best-workout-routine-for-gym-beginners-135325.png?v=1738755379&width=2048";

const types = [" Exercise", " Block", " Superset"];
const types_id = ["_e_", "_b_", "_ss_"];
const set_type = ["rep", "time", "rep_range"];

const getSetList = ({
  program_idx = -1,
  session_idx = -1,
  block_idx = -1,
  superset_idx = -1,
  exercise_idx = -1,
}) => {
  let set_list = [];
  for (let set_idx = 0; set_idx < 5; set_idx++) {
    const set_id_names = get_ids_names({
      program_idx,
      session_idx,
      block_idx,
      superset_idx,
      exercise_idx,
      set_idx,
    });
    let set = {
      order_index: set_idx,
      program_id: set_id_names?.program_id,
      program_asign_id: set_id_names?.program_asign_id,
      session_id: set_id_names?.session_id,
      exercise_id: set_id_names?.exercise_id,
      set_id: set_id_names?.set_id,
      set_name: set_id_names?.set_name,
      type: set_type[exercise_idx % 3],
      rep: set_type[exercise_idx % 3] === "rep" ? 5 : 0,
      time: set_type[exercise_idx % 3] === "time" ? "00:00" : "01:00",
      rep_range:
        set_type[exercise_idx % 3] === "rep_range"
          ? {
              max: 10,
              min: 5,
            }
          : {
              max: 0,
              min: 0,
            },
      weight: "50",
      is_drop_set: set_idx > 2,
      rest: "00:30",
      is_completed: false,
    };
    set_list.push(set);
  }
  return set_list;
};

const getExercise = ({
  program_idx = -1,
  session_idx = -1,
  exercise_idx = -1,
  block_idx = -1,
  superset_idx = -1,
  order_index = -1,
}) => {
  const exe_ids_names = get_ids_names({
    program_idx,
    session_idx,
    block_idx,
    superset_idx,
    exercise_idx,
  });

  let exercise = {
    program_id: exe_ids_names?.program_id,
    program_asign_id: exe_ids_names?.program_asign_id,
    session_id: exe_ids_names?.session_id,
    exercise_id: exe_ids_names?.exercise_id,
    exercise_name: exe_ids_names?.exercise_name,
    block_id: exe_ids_names?.exercise_name,
    image: exercise_image,
    is_completed: false,
    is_block: block_idx !== -1,
    is_superset: block_idx !== -1,
    order_index: order_index,
    category: "Strength",
    equiptment_category: "Strengthening",
    experience_level: "Beginner",
    location: "Home",
    target_groups: ["Bicep left", "Bicep right"],
    description:
      "Description Nunc ac eget neque vivamus amet. Amet quis nunc tempus leo venenatis pellentesque. Justo sed et lacinia at felis ipsum egestas in Nunc ac eget neque vivamus amet. Amet quis nunc tempus leo venenatis pellentesque. Justo sed et lacinia at felis ipsum egestas in Nunc ac eget neque vivamus amet. Amet quis nunc tempus leo venenatis pellentesque. Justo sed et lacinia at felis ipsum egestas in",
    note: "Note Nunc ac eget neque vivamus amet. Amet quis nunc tempus leo venenatis pellentesque. Justo sed et lacinia at felis ipsum egestas in Nunc ac eget neque vivamus amet. Amet quis nunc tempus leo venenatis pellentesque. Justo sed et lacinia at felis ipsum egestas in Nunc ac eget neque vivamus amet. Amet quis nunc tempus leo venenatis pellentesque. Justo sed et lacinia at felis ipsum egestas in",
  };

  exercise.set_list = getSetList({
    program_idx,
    session_idx,
    block_idx,
    superset_idx,
    exercise_idx,
  });
  return exercise;
};

const getSuperset = ({
  program_idx = -1,
  session_idx = -1,
  block_idx = -1,
  superset_idx = -1,
  order_index = -1,
}) => {
  const ss_ids_names = get_ids_names({
    program_idx,
    session_idx,
    block_idx,
    superset_idx,
  });
  let superset = {
    program_id: ss_ids_names?.program_id,
    program_asign_id: ss_ids_names?.program_asign_id,
    session_id: ss_ids_names?.session_id,
    superset_id: ss_ids_names?.superset_id,
    superset_name: ss_ids_names?.superset_name,
    order_index: order_index,
    is_completed: false,
  };
  let exercise_list = [];
  for (let exercise_idx = 0; exercise_idx < 5; exercise_idx++) {
    exercise_list.push(
      getExercise({
        program_idx,
        session_idx,
        block_idx,
        exercise_idx,
        superset_idx,
        order_index,
      })
    );
  }
  superset.exercise_list = exercise_list;
  return superset;
};

const getBlock = ({
  program_idx = -1,
  session_idx = -1,
  block_idx = -1,
  order_index = -1,
}) => {
  const bl_ids_names = get_ids_names({
    program_idx,
    session_idx,
    block_idx,
  });
  let block = {
    program_id: bl_ids_names?.program_id,
    program_asign_id: bl_ids_names?.program_asign_id,
    session_id: bl_ids_names?.session_id,
    block_name: bl_ids_names?.block_name,
    block_id: bl_ids_names?.block_id,
    order_index: order_index,
    is_completed: false,
  };
  let exercise_list = [];
  for (let exercise_idx = 0; exercise_idx < 4; exercise_idx++) {
    if (exercise_idx === 2) {
      exercise_list.push(
        getSuperset({
          program_idx,
          session_idx,
          block_idx,
          superset_idx: exercise_idx,
          order_index: exercise_idx,
        })
      );
    } else {
      exercise_list.push(
        getExercise({
          program_idx,
          session_idx,
          block_idx,
          exercise_idx,
          superset_idx: exercise_idx,
          order_index: exercise_idx,
        })
      );
    }
  }
  block.exercise_list = exercise_list;
  return block;
};

const get_ids_names = ({
  program_idx = -1,
  session_idx = -1,
  block_idx = -1,
  superset_idx = -1,
  exercise_idx = -1,
  set_idx = -1,
}) => {
  // Short codes
  const programPart = program_idx > -1 ? `p_${program_idx}` : "";
  const assignProgramPart = program_idx > -1 ? `a_${programPart}` : "";
  const programName = program_idx > -1 ? `Program_${program_idx}` : "";

  const sessionPart =
    program_idx > -1 && session_idx > -1
      ? `${programPart}_s_${session_idx}`
      : "";
  const sessionName =
    program_idx > -1 && session_idx > -1
      ? `${programName}_Session_${session_idx}`
      : "";

  let blockPart = "",
    blockName = "";
  let supersetPart = "",
    supersetName = "";
  let exercisePart = "",
    exerciseName = "";
  let setPart = "",
    setName = "";

  // Chain 1: Program > Session > Block > Superset > Exercise > Set
  if (block_idx > -1) {
    blockPart = `${sessionPart}_bl_${block_idx}`;
    blockName = `${sessionName}_Block_${block_idx}`;
    if (superset_idx > -1) {
      supersetPart = `${blockPart}_ss_${superset_idx}`;
      supersetName = `${blockName}_Superset_${superset_idx}`;
      if (exercise_idx > -1) {
        exercisePart = `${supersetPart}_ex_${exercise_idx}`;
        exerciseName = `${supersetName}_Exercise_${exercise_idx}`;
        if (set_idx > -1) {
          setPart = `${exercisePart}_st_${set_idx}`;
          setName = `${exerciseName}_Set_${set_idx}`;
        }
      }
    }
  }
  // Chain 2: Program > Session > Superset > Exercise > Set
  else if (superset_idx > -1) {
    supersetPart = `${sessionPart}_ss_${superset_idx}`;
    supersetName = `${sessionName}_Superset_${superset_idx}`;
    if (exercise_idx > -1) {
      exercisePart = `${supersetPart}_ex_${exercise_idx}`;
      exerciseName = `${supersetName}_Exercise_${exercise_idx}`;
      if (set_idx > -1) {
        setPart = `${exercisePart}_st_${set_idx}`;
        setName = `${exerciseName}_Set_${set_idx}`;
      }
    }
  }
  // Chain 3: Program > Session > Exercise > Set
  else if (exercise_idx > -1) {
    exercisePart = `${sessionPart}_ex_${exercise_idx}`;
    exerciseName = `${sessionName}_Exercise_${exercise_idx}`;
    if (set_idx > -1) {
      setPart = `${exercisePart}_st_${set_idx}`;
      setName = `${exerciseName}_Set_${set_idx}`;
    }
  }

  return {
    program_id: programPart,
    program_asign_id: assignProgramPart,
    program_name: programName,
    session_id: sessionPart,
    session_name: sessionName,
    block_id: blockPart,
    block_name: blockName,
    superset_id: supersetPart,
    superset_name: supersetName,
    exercise_id: exercisePart,
    exercise_name: exerciseName,
    set_id: setPart,
    set_name: setName,
  };
};

const get_program_list = () => {
  let program_list = [];

  for (let program_idx = 0; program_idx <= 3; program_idx++) {
    const prg_ids_names = get_ids_names({
      program_idx,
    });
    let program = {
      program_id: prg_ids_names?.program_id,
      program_asign_id: prg_ids_names?.program_asign_id,
      program_name: prg_ids_names?.program_name,
      program_image: program_image,
      program_audio: "audio_link",
      fitness_level: "Beginner",
      program_description:
        "Description Nunc ac eget neque vivamus amet. Amet quis nunc tempus leo venenatis pellentesque. Justo sed et lacinia at felis ipsum egestas in Nunc ac eget neque vivamus amet. Amet quis nunc tempus leo venenatis pellentesque. Justo sed et lacinia at felis ipsum egestas in Nunc ac eget neque vivamus amet. Amet quis nunc tempus leo venenatis pellentesque. Justo sed et lacinia at felis ipsum egestas in",
      is_completed: false,
    };

    let session_list = [];
    for (let session_idx = 0; session_idx <= 3; session_idx++) {
      const sess_ids_names = get_ids_names({
        program_idx,
        session_idx,
      });
      let session = {
        program_id: prg_ids_names?.program_id,
        program_asign_id: prg_ids_names?.program_asign_id,
        session_id: sess_ids_names?.session_id,
        session_name: sess_ids_names?.session_name,
        image: session_image,
        audio: audio_link,
        is_completed: false,
        location: "Home",
        assign_date:
          "2025-08-" +
          (18 + session_idx >= 10
            ? 18 + session_idx
            : "1" + (18 + session_idx)),
      };
      let exercise_list = [];
      for (let ex_ss_bl_idx = 0; ex_ss_bl_idx <= 3; ex_ss_bl_idx++) {
        switch (ex_ss_bl_idx) {
          case 0:
          case 1:
          case 4: {
            exercise_list.push(
              getExercise({
                program_idx,
                session_idx,
                order_index: ex_ss_bl_idx,
                exercise_idx: ex_ss_bl_idx,
              })
            );
            break;
          }
          case 2: {
            // superset
            exercise_list.push(
              getSuperset({
                program_idx,
                session_idx,
                order_index: ex_ss_bl_idx,
                superset_idx: ex_ss_bl_idx,
              })
            );
            break;
          }
          case 3: {
            // block
            exercise_list.push(
              getBlock({
                program_idx,
                session_idx,
                block_idx: ex_ss_bl_idx,
                order_index: ex_ss_bl_idx,
              })
            );

            break;
          }
        }
      }
      session.exercise_list = exercise_list;
      session_list.push(session);
    }

    program.session_list = session_list;
    program_list.push(program);
  }
  return program_list;
};

export const create_json_database = async () => {
  const program_list = get_program_list();

  try {
    await fs.writeFile("workout_database.json", JSON.stringify(program_list));
    return {
      data: program_list,
      message: "Database created successfully!!",
      status: 200,
    };
  } catch (err) {
    console.log("err", err);
    return {
      data: [],
      message: "Database could not be created!!",
      status: 500,
    };
  }
};
