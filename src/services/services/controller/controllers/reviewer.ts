import ArbiterController from "./arbiter";
import {CharsheetReviewRequest} from "../../../../model/charsheets/types";
import {ControllerException} from "../../../../model/exceptions";

export default class ReviewerController extends ArbiterController {
    async generateReview(info: CharsheetReviewRequest) {
        function isReview(response: unknown): response is { review: string } {
            return typeof response === "object" && response != null && "review" in response;
        }
        function isError(response: unknown): response is { error: string } {
            return typeof response === "object" && response != null && "error" in response;
        }
        const response = await this.services.get("API").createRequest(
            "charReview.generate",
            "",
            JSON.stringify(info))
        const json: unknown = await response.json()
        if(isReview(json)) return json.review;
        if(isError(json)) throw new ControllerException(json.error)
        return ""
    }
}