const get_session_exercise_set_list = ({
  program_id = "",
  program_asign_id = "",
  session_id = "",
  exercise_id = "",
  block_id = "",
  superset_id = "",
  type_index = 0,
}) => {
  const type = ["rep", "time", "rep_range"];
  const set_list = [];
  for (let set_idx = 0; set_idx <= 4; set_idx++) {
    let set = {
      _id: exercise_id + "_st_" + set_idx,
      program_id: program_id,
      program_asign_id: program_asign_id,
      session_id: session_id,
      exercise_id: exercise_id,
      type: type[type_index],
      rep: type[type_index] === "rep" ? 5 : 0,
      time: type[type_index] === "time" ? "00:00" : "01:00",
      rep_range:
        type[type_index] === "rep_range"
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
    if (block_id) {
      set.block_id = block_id;
    }
    if (superset_id) {
      set.block_id = superset_id;
    }
    set_list.push(set);
  }
  return set_list;
};
