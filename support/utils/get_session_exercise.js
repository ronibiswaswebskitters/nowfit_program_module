const exercise_image =
  "https://explosivewhey.com/cdn/shop/articles/best-workout-routine-for-gym-beginners-135325.png?v=1738755379&width=2048";

const get_id_name = ({
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

export const get_session_exercise = ({
  program_idx = -1,
  session_idx = -1,
  block_idx = -1,
  superset_idx = -1,
  exercise_idx = -1,
  set_idx = -1,
}) => {
  const all_ids = get_id_name({
    program_idx,
    session_idx,
    block_idx,
    superset_idx,
    exercise_idx,
    set_idx,
  });

  return {
    program_id: program_id,
    program_asign_id: program_asign_id,
    session_id: session_id,
    _id:
      program_id +
      "_" +
      session_id +
      "_" +
      (block_id ? block_id + "_" : "") +
      (superset_id ? superset_id + "_" : "") +
      exercise_id,
    name: exercise_name,
    image: exercise_image,
    is_block: false,
    is_superset: false,
    order_index: superset_id ? superset_id : block_id ? block_id : exercise_id,
    category: "Strength",
    equiptment_category: "Strengthening",
    experience_level: "Beginner",
    location: "Home",
    target_groups: ["Bicep left", "Bicep right"],
    description:
      "Description Nunc ac eget neque vivamus amet. Amet quis nunc tempus leo venenatis pellentesque. Justo sed et lacinia at felis ipsum egestas in Nunc ac eget neque vivamus amet. Amet quis nunc tempus leo venenatis pellentesque. Justo sed et lacinia at felis ipsum egestas in Nunc ac eget neque vivamus amet. Amet quis nunc tempus leo venenatis pellentesque. Justo sed et lacinia at felis ipsum egestas in",
    note: "Note Nunc ac eget neque vivamus amet. Amet quis nunc tempus leo venenatis pellentesque. Justo sed et lacinia at felis ipsum egestas in Nunc ac eget neque vivamus amet. Amet quis nunc tempus leo venenatis pellentesque. Justo sed et lacinia at felis ipsum egestas in Nunc ac eget neque vivamus amet. Amet quis nunc tempus leo venenatis pellentesque. Justo sed et lacinia at felis ipsum egestas in",
    is_completed: false,
    set_list: get_set_list({
      program_asign_id: program_asign_id,
      exercise_id: exercise_id,
      program_id: program_id,
      session_id: session_id,
      type_index: superset_id
        ? superset_id % 3
        : block_id
        ? block_id % 3
        : exercise_id % 3,
    }),
  };
};
