export enum Mode {
    SINGLE = "Single",
    MULTI = "Multi"
}

export enum ServerMode {
    PRIVATE = "PRIVATE",
    PUBLIC = "PUBLIC"
}

export enum ServerCallbacks {
    OK = 'ok',
    ERROR = 'Error'
}

export enum ServerReasons {
    USEREXIST = "Username taken",
    TESTEXIST = "This test name exist"
}

export interface PBCall {
    status: ServerCallbacks
    reason?: ServerReasons;
    test?: string;
}

export interface  PVCall {
    status: ServerCallbacks
    username?: string,
    reason?: ServerReasons;
    test?: string;

}