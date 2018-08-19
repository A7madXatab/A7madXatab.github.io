
let rootUrl = "http://localhost:3000";

        $("#new-post").on("click",()=>{
              $("#post-form").toggle();
            })
        $("#clearButton").on("click",()=>{
                $(".form-control").html(" ")
        })
        $("#cancelButton").on("click",()=>{
                $("#post-form").hide();
        })
        $("#comments").on("click",()=>{
        $(".c").addClass("card").toggle();
        })

$("#createUser").on("click",()=>{
         let name = $("#name").val();
         let userEmail = $("#email").val(); 
         let userName = $("#userName").val();
         console.log(userName)
         let obj = {
                 name:name,
                 email:userEmail,
                 userName:userName
         }
        add__Delete__Edit("POST","/users",obj)    
})

$("#postButton").on("click",()=>{
        let postTitle = $("#title").val();
        let ownerOfPost = $("#owner-of-post").val();
        let postBody =$("textarea").val();
        let userId = findUserId(ownerOfPost);
        console.log(userId)
        let postObj = {
                title:postTitle,
                body:postBody,
                owner:ownerOfPost,
                userId:userId
        }
       
        // add__Delete("POST","/posts",postObj)
})
$("#postComment").on("click",()=>{
        
})
function findUserId(userName)
{
        let nn;
        let xhr = new XMLHttpRequest();
        xhr.addEventListener("load",()=>{
               let users = JSON.parse(xhr.responseText);
               users.forEach(element => {
                       if(element.userName=== userName)
                       {
                               console.log(element.id)
                               return element.id;
                       }
               });
        })
        xhr.open("GET",rootUrl+"/users");
        xhr.send();
}
function add__Delete__Edit(method,dir,obj)
{
        let directory = rootUrl+dir;
        if(method === "POST")
        {
          axios.post(directory,obj)
        }
        if(method === "DELETE")
        {
                axios.delete(directory+"/"+obj.id);
        }
        if(method === "PUT")
        {
                axios.put(directory+"/"+obj.id,obj)
        }
}
function render()
{
fetch(rootUrl+"/users")
  .then(res=>res.json())
  .then(res=>{
        let tbody = findTable("usersTable") 
       res.forEach(user => {
               let editBtn = $("<button>").addClass("btn editBtn mx-1").html("Edit");
               let delBtn =  $("<button>").addClass("btn delBtn mx-1").html("Delete");
                       let tr = $("<tr>").append([
                       $("<td>").html(user.id),
                       $("<td>").html(user.name),
                       $("<td>").html(user.userName)
               ])
               let td = $("<td>").html([
                      editBtn,
                      delBtn
               ])
               delBtn.on("click",()=>{
                       add__Delete__Edit("DELETE","/users",user)
               })
               editBtn.on("click",()=>{
                //        axios.delete(rootUrl+"/users"+"/3")
                     let cols = $("#post-form input");
                     cols[0].value=user.name;
                     cols[1].value=user.email;
                     cols[2].value = user.userName;
                     let saveButton = $("<button>").addClass("btn btn-success mt-2").html("Save");
                     $(".form-group").append(saveButton);
                     saveButton.on("click",()=>{
                           user.name = cols[0].value;
                           user.email = cols[1].value;
                           user.userName = cols[2].value;
                           add__Delete__Edit("PUT","/users",user)
                           $(".form-control").html(" ");
                           saveButton.remove();
                     })
                     $(".users-form").show();
               })
               tr.append(td);
               tbody.append(tr);
       });

  })
fetch(rootUrl+"/posts")
   .then(res=>res.json())
   .then(res=>{
            let postsTable = findTable("postsTable")
            res.forEach(post=>{
              let tr = $("<tr>").append([
                $("<td>").html(post.id),
                $("<td>").html(post.title),
                $("<td>").html(post.body)])
                let editBtn = $("<button>").addClass("btn editBtn mx-1").html("Edit");
                let delBtn =  $("<button>").addClass("btn delBtn mx-1").html("Delete");

                let td = $("<td>").append([editBtn,delBtn]);
                tr.append(td);
                postsTable.append(tr);
            })
   })
fetch(rootUrl+"/comments")
 .then(response=>response.json())
 .then(response=>{
              let commentsTable = findTable("commentsTable");
              response.forEach(comment=>{
                let tr = $("<tr>").append([
                        $("<td>").html(comment.postId),
                        $("<td>").html(comment.body)])
                        let editBtn = $("<button>").addClass("btn editBtn mx-1").html("Edit");
                        let delBtn =  $("<button>").addClass("btn delBtn mx-1").html("Delete");
        
                        let td = $("<td>").append([editBtn,delBtn]);
                        tr.append(td);
                        commentsTable.append(tr);
              })
 })
}
render();
 function findTable(Class)
{
        return $(`.${Class} tbody`);
}



// axios.post(rootUrl+"/users",{
//         name:"Dummy",
//         userName:"Dummy"
// })