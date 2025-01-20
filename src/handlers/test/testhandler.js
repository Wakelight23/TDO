const testHandler = async ({ socket, sequence, payload }) => {
    try {  
        console.log("\n이게 나온다면 헨들러에서 잘못 맵핑한거 아님 클라에서 잘못 줬거나.");
        console.log("\nsequence:",sequence,"\npayload:",payload);
    } catch (error) {
      console.error(error)
    }
  };
  
  
  export default testHandler;