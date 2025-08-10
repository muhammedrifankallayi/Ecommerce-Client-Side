import { Category, Product } from "@/types";
import { apiService } from './api';
import { ENDPOINTS } from './config';


export interface LandingUiResponse {
    data: {
        categories: Category[];
        featuredProducts: Product[];
    },
    success: boolean;
    }



export class LandingUiService {
    private basePath = ENDPOINTS.landingUi;
    async getLandingUi(): Promise<LandingUiResponse> {
        return apiService.get<LandingUiResponse>(this.basePath);
    }

}

export const landingUiService = new LandingUiService();



