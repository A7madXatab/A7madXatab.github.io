let rootUrl = "http://localhost:3000";

function addElements()
{
        let cc = $("#cc");
        fetch(rootUrl+"/categories")
         .then(res=>res.json())
         .then(res=>{
                 res.forEach(element=>{
                       let a = $("<input>")
                                .attr("type","radio")
                                .attr("name","category")
                                .attr("id","materialChecked2")
                                .val(element.name)
                                .addClass("col-lg-3 col-sm-1 col-md-3")
                      let label  = $("<label>").html(element.name).addClass("col-lg-8 col-sm-4 col-md-7");
                      let div = $("<div>").addClass("border-bottom");
                      div.append([a,label]);
                      cc.append(div);
                 })
         }) 
         let xx = $("#usersList");
         fetch(rootUrl+"/users")
          .then(res=>res.json())
          .then(response=>{
                  response.forEach(user=>{
                          xx.append($("<div>").html(user.userName).addClass("border-bottom col-lg-12 py-1"));
                  })
          })
          let postsList = $("#postsList");
           fetch(rootUrl+"/posts")
            .then(res=>res.json())
            .then(response=>{
                response.forEach(post=>{
                    console.log("assdlasudh")
                })
            })
}