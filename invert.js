Threading(mode){
    // 接收mode，表明方式
    let nodeArr = [];
    if(mode=='pre'){
      nodeArr = this.preOrderTraversal();
    }else if(mode == 'in'){
      nodeArr = this.inOrderTraversal();
    }else{
      nodeArr = this.postOrderTraversal();
    }

    nodeArr.forEach((node,index) => {
      if(!node.left){
        if(index == 0){
          node.left = '空'
        }else{
          node.left = nodeArr[index-1];
        }
        // JS允许在创建完一个对象后，动态给对象添加属性。
        node.LFlag = true;
      }
      if(!node.Rgiht){
        if(index == nodeArr.length-1){
          node.right = '空'
        }else{
          node.right = node[index+1]
        }
      }
    });
    return nodeArr;
  
}

