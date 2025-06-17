import {Polar} from "@polar-sh/sdk";
import {ValidatedLicenseKey} from "@polar-sh/sdk/dist/esm/models/components/validatedlicensekey";
import dotenv from "dotenv";

dotenv.config();

const licenseKey = process.env.TM_LICENSE_KEY || "";

const polar = new Polar();

export async function validLicenseKey(): Promise<ValidatedLicenseKey | null> {
    try {
        if (!licenseKey.startsWith("CSVGORC-")) {
            console.log("Licence key is invalid");
            return null;
        }
        return await polar.customerPortal.licenseKeys.validate({
            key: licenseKey,
            organizationId: "a3589765-5720-4963-a730-fb1109a0dc2b",
        })
    } catch (error) {
        console.error("Error validating license key:", error);
        return null;
    }
}