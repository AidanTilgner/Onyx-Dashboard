import { Router } from "express";
import { actionServer, interpretationServer } from "../utils/axios";
import { config } from "dotenv";
import multer from "multer";
import { globalLog } from "../utils/logger";

config();
const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
});

const getTokenFromRequest = (req: any) => {
  const useToken: string =
    (req.query.token as string) ||
    (req.headers["x-access-token"] as string) ||
    (req.headers["authorization"]?.split(" ")[1] as string);

  const found = useToken
    ? useToken
    : process.env.NODE_ENV === "development"
    ? "testing"
    : "";

  return found;
};

router.get("/actions", async (req, res) => {
  try {
    const response = await actionServer.get("/actions", {
      headers: {
        "x-access-token": getTokenFromRequest(req),
      },
    });
    return res.send(response.data);
  } catch (err) {
    console.error("Error: ", err);
    return res.send({
      error: err,
    });
  }
});

router.get("/recent-actions", async (req, res) => {
  try {
    const response = await actionServer.get("/actions/recent", {
      headers: {
        "x-access-token": getTokenFromRequest(req),
      },
    });
    return res.send(response.data);
  } catch (err) {
    console.error("Error: ", err);
    return res.send({
      error: err,
    });
  }
});

router.get("/actions/:action", async (req, res) => {
  try {
    const response = await actionServer.get(`/actions/${req.params.action}`, {
      headers: {
        "x-access-token": getTokenFromRequest(req),
      },
    });
    return res.send(response.data);
  } catch (err) {
    console.error("Error: ", err);
    return res.send({
      error: err,
    });
  }
});

router.post("/actions/:action", async (req, res) => {
  try {
    const response = await actionServer.post(
      `/actions/${req.params.action}`,
      {},
      {
        headers: {
          "x-access-token": getTokenFromRequest(req),
        },
      }
    );
    return res.send(response.data);
  } catch (err) {
    console.error("Error: ", err);
    return res.send({
      error: err,
    });
  }
});

router.get("/actions/metadata/:action", async (req, res) => {
  try {
    const response: any = await actionServer.get(
      `/actions/metadata/${req.params.action}`,
      {
        headers: {
          "x-access-token": getTokenFromRequest(req),
        },
      }
    );
    globalLog("Got action metadata: ", response.data);
    return res.send(response.data);
  } catch (err) {
    console.error("Error: ", err);
    return res.send({
      error: err,
    });
  }
});

router.post("/nlu", async (req, res) => {
  try {
    const response: any = await interpretationServer.post("/nlu", req.body, {
      headers: {
        "x-access-token": getTokenFromRequest(req),
      },
    });
    return res.send(response.data);
  } catch (err) {
    console.error("Error: ", err);
  }
});

router.post("/nlu/test", async (req, res) => {
  try {
    // test that the nlu server is running with a timeout of 5 seconds
    const response = await interpretationServer.post("/nlu", req.body, {
      timeout: 5000,
      headers: {
        "x-access-token": getTokenFromRequest(req),
      },
    });
    return res.send(response.data);
  } catch (err) {
    console.error("Error: ", err);
    res.send({
      error: err,
    });
  }
});

router.post("/nlu/chat", async (req, res) => {
  try {
    const response = await interpretationServer.post("/chat", req.body, {
      headers: {
        "x-access-token": getTokenFromRequest(req),
      },
    });
    return res.send(response.data);
  } catch (err) {
    console.error("Error: ", err);
    return res.send({
      error: err,
    });
  }
});

export default router;

const destinations: { [key: string]: string | undefined } = {
  ACTIONS: process.env.ACTION_SERVER_HOST,
  SPEECH: process.env.SPEECH_SERVER_HOST,
  APPLICATIONS: process.env.APPLICATIONS_SERVER_HOST,
  INTERPRETATION: process.env.INTERPRETATION_SERVER_HOST,
};
