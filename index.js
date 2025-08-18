const express = require("express");
const { create_json_database } = require("./support/create_json_database");
const { fetch_program_list } = require("./support/fetch_a_program_list");
const { fetch_program_details } = require("./support/fetch_b_program_details");
const { fetch_session_details } = require("./support/fetch_c_session_details");
const {
  fetch_exercise_details,
} = require("./support/fetch_d_exercise_details");
const { update_session_details } = require("./support/update_session_details");
const app = express();
const PORT = 5500;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello from Express backend!");
});

app.get("/api/client/program_module/create_json_database", async (req, res) => {
  const data = await create_json_database();
  res.status(data.status).json(data);
});

app.get("/api/client/program_module/program_list", async (req, res) => {
  const result = await fetch_program_list();
  res.status(result.status).json(result);
});

app.post("/api/client/program_module/program_details", async (req, res) => {
  const { program_id, program_asign_id } = req.body;

  if (!program_id || !program_asign_id) {
    return res.status(400).json({
      message: "program_id and program_asign_id are required",
      status: 400,
    });
  }

  const result = await fetch_program_details(program_id, program_asign_id);
  res.status(result.status).json(result);
});

app.post("/api/client/program_module/session_details", async (req, res) => {
  const { program_id, program_asign_id, session_id, full_details } = req.body;

  if (!program_id || !program_asign_id || !session_id) {
    return res.status(400).json({
      message: "program_id, program_asign_id, and session_id are required",
      status: 400,
    });
  }

  const result = await fetch_session_details(
    program_id,
    program_asign_id,
    session_id,
    full_details || false
  );
  res.status(result.status).json(result);
});

app.post(
  "/api/client/program_module/session_details_update",
  async (req, res) => {
    const { program_id, program_asign_id, session_id, sessionDetails, type } =
      req.body;

    if (
      !program_id ||
      !program_asign_id ||
      !session_id ||
      !sessionDetails ||
      !type
    ) {
      return res.status(400).json({
        message:
          "type, program_id, program_asign_id, session_id and sessionDetails required",
        status: 400,
      });
    }

    const result = await update_session_details(
      type,
      program_id,
      program_asign_id,
      session_id,
      sessionDetails
    );
    res.status(result.status).json(result);
  }
);

app.post("/api/client/program_module/exercise_details", async (req, res) => {
  const { program_id, program_asign_id, session_id, exercise_id } = req.body;

  if (!program_id || !program_asign_id || !session_id || !exercise_id) {
    return res.status(400).json({
      message:
        "program_id, program_asign_id, session_id and exercise_idare required",
      status: 400,
    });
  }

  const result = await fetch_exercise_details(
    program_id,
    program_asign_id,
    session_id,
    exercise_id
  );
  res.status(result.status).json(result);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
