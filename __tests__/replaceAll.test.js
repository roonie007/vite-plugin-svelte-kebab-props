const { replaceAll } = require('../src/main');

describe('replaceAll', () => {
  it('should correctly replace you by they in a string', () => {
    const str = `If you're looking for random paragraphs, you've come to the right place.`;
    const resultStr = `If they're looking for random paragraphs, they've come to the right place.`;

    expect(replaceAll(str, 'you', 'they')).toEqual(resultStr);
  });

  it('should correctly replace a button tag in a HTML code', () => {
    const str = `<!DOCTYPE html>
    <html>
    <body>
    
    <h2>Demo JavaScript in Body</h2>
    
    <p id="demo">A Paragraph.</p>
    
    <button type="button" onclick="myFunction()">Try it</button>
    
    <script>
    function myFunction() {
      document.getElementById("demo").innerHTML = "Paragraph changed.";
    }
    </script>
    
    </body>
    </html>`;

    const resultStr = `<!DOCTYPE html>
    <html>
    <body>
    
    <h2>Demo JavaScript in Body</h2>
    
    <p id="demo">A Paragraph.</p>
    
    <a type="button" onclick="myFunction()">Try it</a>
    
    <script>
    function myFunction() {
      document.getElementById("demo").innerHTML = "Paragraph changed.";
    }
    </script>
    
    </body>
    </html>`;

    const firstReplace = replaceAll(str, '<button', '<a');
    expect(replaceAll(firstReplace, '</button>', '</a>')).toEqual(resultStr);
  });
});
