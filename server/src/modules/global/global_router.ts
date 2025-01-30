import {Router} from "express";
import {redirectAd} from "./global_controller";


const router = Router();

router.get("/advertisement", redirectAd);
router.get("/sitemap.xml", redirectAd);

export default router;