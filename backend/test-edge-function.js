const fetch = require('node-fetch');

async function testEdgeFunction() {
  try {
    const response = await fetch('http://localhost:54321/functions/v1/notify-estimate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token'
      },
      body: JSON.stringify({
        estimateId: 'test-estimate-id'
      })
    });

    const result = await response.json();
    console.log('응답:', result);
  } catch (error) {
    console.error('에러:', error);
  }
}

testEdgeFunction(); 