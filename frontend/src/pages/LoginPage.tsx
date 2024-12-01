import {Autocomplete, Button, Card, Divider, Input, Stack, Typography} from "@mui/joy";
import {AuthRole} from "../../../common/Auth.ts";
import {useEffect, useState} from "react";
import {LARGE_PART, PAD, PAD2, SMALL_PART, TOURNAMENT_NAME} from "../constants.ts";
import toast from "react-hot-toast";
import {handleReturn, postReq} from "../net.ts";
import {sha256} from "js-sha256";

interface RoleOption {
    label: string;
    role: AuthRole;
    module: string;
}

const ROLES: RoleOption[] = [
    {
        label: "Admin",
        role: AuthRole.Admin,
        module: "admin"
    },
    {
        label: "Referee",
        role: AuthRole.Referee,
        module: "match"
    },
    {
        label: "Guest",
        role: AuthRole.Guest,
        module: "guest"
    },
]

export default function LoginPage() {
    const [role, setRole] = useState<RoleOption | undefined>();
    const [password, setPassword] = useState<string>("");

    useEffect(() => {
        document.title = "VGORC TM | Login";
    }, []);

    function handleSubmit() {
        if (!role) {
            toast.error("Role cannot be empty");
            return;
        }
        if (password.length === 0) {
            toast.error("Password cannot be empty");
            return;
        }
        if (role.role === AuthRole.Guest) {
            toast.error("Guest do not need login");
            return;
        }
        postReq(`/auth/${role.module}`, {
            authRole: role.role,
            authPassword: sha256(password)
        }).then((res) => {
            if (res.value) {
                setCookie("permission", res.value, res.maxAge, res.path);
                toast.success("Login successfully");
                setTimeout(() => {
                    handleReturn();
                }, 1000);
            } else {
                toast.error("Failed to login");
            }
        }).catch();
    }

    return (
        <Card
            sx={{
                textAlign: 'center',
                alignItems: 'center',
                overflow: 'auto',
                width: `${LARGE_PART}%`,
                height: `${SMALL_PART}vh`,
                minWidth: `${SMALL_PART/2}rem`
            }}
        >
            <Typography level='title-lg' sx={{m: PAD}}>
                Login to {TOURNAMENT_NAME}
            </Typography>
            <Divider/>
            <Stack gap={PAD2} sx={{height: '100%', justifyContent: 'center', width: `${LARGE_PART}%`}}>
                <Autocomplete
                    options={ROLES}
                    value={role}
                    size="lg"
                    placeholder="Role"
                    onChange={(_e, r) => setRole(r || role)}
                />
                <Input
                    value={password}
                    placeholder="Password"
                    size="lg"
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                />
            </Stack>
            <Divider/>
            <Button sx={{width: `${LARGE_PART}%`, m: PAD}} onClick={() => handleSubmit()}>
                Login
            </Button>
        </Card>
    );
}

function setCookie(name: string, value: string, maxAge?: number, path?: string) {
    eraseCookie(name);
    let expires = "";
    if (maxAge) {
        const date = new Date();
        date.setTime(date.getTime() + maxAge);
        expires = "; expires=" + date.toUTCString();
    }
    console.log(name + "=" + (value || "")  + expires + `; path=${path || "/"}`);
    document.cookie = name + "=" + (value || "")  + expires + `; path=${path || "/"}`;
}

function eraseCookie(name: string) {
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}
