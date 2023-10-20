let count;

window.addEventListener('load', createDashboard); //onload event listener

function createDashboard(){
    let dashboard = document.getElementById("dashboard");

   

    // instruction
    let instruction = document.createElement("div");
    instruction.setAttribute("id", "instruction");
    instruction.innerHTML = "<h3 style='text-align: center;'>Instructions</h3>" +
                            "<ul>" +
                                "<li>Flip over two cards.</li>" + 
                                "<li>If the two cards have the same picture, they will then continue flip two cards. If pictures are different, you lost!</li>" +
                            "</ul>";
    dashboard.appendChild(instruction);

     // result
     let result = document.createElement("div");
     result.setAttribute("id", "result");
     dashboard.appendChild(result);
  
    // button
    let rtButton=document.createElement("button");
    rtButton.setAttribute("id", "rtButton");
    rtButton.style.display="none";
    dashboard.appendChild(rtButton);
}

