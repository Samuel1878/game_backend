var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import app from "./app.js";
import "module-alias/register";
import { pool } from "./config/db.config.js";
const PORT = process.env.PORT || 3000;
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield pool.query("SELECT 1");
    console.log("DB ready");
    app.listen(PORT, () => {
        console.log(`Server running on ${PORT}`);
    });
}))();
//# sourceMappingURL=server.js.map