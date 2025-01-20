class CustomError extends Error {
    constructor(code, message) {
      super(message); //기본 메세지를 그대로 사용한데.
      this.code = code;
      this.name = 'CustomError';
    }
  }
  
  export default CustomError;