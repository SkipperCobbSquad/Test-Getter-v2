export enum Mode {
    SINGLE = "Single",
    MULTI = "Multi"
}

export enum ServerCallbacks {
    OK = 'ok',
    ERROR = 'Error'
}

export enum ServerReasons {
    USEREXIST = "Username taken",
    TESTEXIST = "This test name exist"
}

export interface Call {
    status: ServerCallbacks
    reason?: ServerReasons;
}