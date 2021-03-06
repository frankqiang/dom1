/*
再一个对象上添加方法：
旧方法是：dom{
    create:function(){
        语句...
    }
} 
新方法是：dom{
    直接写函数，不用加function了
    create(){
        语句...
    }
}
 */
//在window上面创建一个dom对象
window.dom = {
    //创建元素
    create(string) {
        //template标签可以容纳所有标签，但是内容却不会显示在HTML中，比如div里面是不能容纳td标签的，写了跟没写一样
        const container = document.createElement("template");
        container.innerHTML = string.trim(); //去除参数两边空格
        return container.content.firstChild; //使用template时，获取它里面的元素需要使用content
    },
    //在节点后面新增节点after(节点, 新增的节点)
    after(node, node2) {
        node.parentNode.insertBefore(node2, node.nextSiblings);
    },
    //在节点前面新增节点 before(节点, 新增的节点)
    before(node, node2) {
        node.parentNode.insertBefore(node2, node);
    },
    //添加节点append(父级节点，被添加的节点)
    append(parent, node) {
        parent.appendChild(node);
    },
    //包裹子级节点 wrap(子级节点，父级节点)
    wrap(node, parent) {
        dom.before(node, parent);
        dom.append(parent, node);
    },
    //删除节点remove(要删除的节点)
    remove(node) {
        node.parentNode.removeChild(node);
        return node; //删除节点后返回该节点的引用
    },
    //删除父级节点的全部子节点empty(父级节点)，并以数组形式返回所有被删除节点的引用
    empty(node) {
        const array = [];
        while (node.firstChild) {
            array.push(dom.remove(node.firstChild))
        }
        return array;
    },
    //设置属性和读取属性attr(节点，属性名，属性值)
    attr(node, name, value) {
        if (arguments.length === 3) { //重载，根据函数参数的不同去实现不同的功能叫做重载
            node.setAttribute(name, value);
        } else if (arguments.length === 2) {
            return node.getAttribute(name);
        }
    },
    //设置和获取节点文本内容text(节点，文本内容)
    text(node, string) {
        if (arguments.length === 2) {
            //适配旧款IE和新版浏览器
            if ("innerText" in node) {
                node.innerText = string;
            } else {
                node.textContent = string;
            }
        } else if (arguments.length === 1) {
            if ("innerText" in node) {
                return node.innerText;
            } else {
                return node.textContent;
            }
        }
    },
    //设置和获取节点内容html(节点，所有内容)
    html(node, string) {
        if (arguments.length === 2) {
            node.innerHTML = string;
        } else if (arguments.length === 1) {
            return node.innerHTML;
        }
    },
    //设置和获取节点样式(节点,[字符串/对象],[字符串])
    style(node, name, value) {
        //三个参数：dom.style(node,"color","red")
        if (arguments.length === 3) {
            node.style[name] = value; //这里需要用[]号，不用的话name就直接变成name字符串了
        }
        //两个参数：dom.style(node,"color") 
        else if (arguments.length === 2) {
            if (typeof name === "string") {
                return node.style[name];
            }
            //两个参数：dom.style(node,{border:"1px solid red",color:"red"})
            else if (name instanceof Object) {
                for (let key in name) { //key属性名，name[key]属性值
                    node.style[key] = name[key];
                }
            }
        }
    },
    //添加、删除、判断节点的类
    class: {
        add(node, className) {
            node.classList.add(className);
        },
        remove(node, className) {
            return node.classList.remove(className);
        },
        has(node, className) {
            return node.classList.contains(className)
        }
    },
    //添加事件on(node,eventName,function)
    on(node, eventName, fn) {
        node.addEventListener(eventName, fn);
    },
    //移除事件off(node,eventName,function)
    off(node, eventName, fn) {
        node.removeEventListener(eventName, fn);
    },
    //获得多个元素或者在特定元素中找某个元素find(selector,nodescope)
    find(selector, nodescope) {
        return (nodescope || document).querySelectorAll(selector);
    },
    //获得一个节点的父节点parent(node)
    parent(node) {
        return node.parentNode;
    },
    //获得一个节点的全部子节点children(node)
    children(node) {
        return node.children;
    },
    //获得节点的所有兄弟节点但是除了自己 siblings(node)
    siblings(node) {
        //node.parentNode.children得到的是一个伪数组，需要通过Array.from()变成数组
        //在调用数组的filter方法把自己这个节点去掉，剩下的节点通过数组的方式返回
        return Array.from(node.parentNode.children).filter(n => n !== node);
    },
    //获得节点后面的一个兄弟节点 next(node)
    next(node) {
        // 获得节点的下一个兄弟节点
        let x = node.nextSibling;
        // 判断它的下一个兄弟节点是否存在，存在在判断它的节点类型是否是文本节点
        while (x && x.nodeType === 3) { //文本节点的nodeType=3
            x = x.nextSibling; //是文本节点，则再继续获得下一个兄弟节点
        }
        return x;
    },
    //获得节点前面的一个兄弟节点previous(node)
    previous(node) {
        // 获得节点的下一个兄弟节点
        let x = node.previousSibling;
        // 判断它的下一个兄弟节点是否存在，存在在判断它的节点类型是否是文本节点
        while (x && x.nodeType === 3) { //文本节点的nodeType=3
            x = x.previousSibling; //是文本节点，则再继续获得下一个兄弟节点
        }
        return x;
    },
    //遍历每个节点，执行处理函数fn each(nodeList)
    // each.(nodeList,function fn(params) {
    //    dom.style(params,{color:red})
    // })
    each(nodeList, fn) {
        for (let i = 0; i < nodeList.length; i++) {
            fn.call(null, nodeList[i]);
        }
    },
    //获得节点在父节点中的索引  index(node)
    index(node) {
        //获得父节点中所有的子节点
        const list = dom.children(node.parentNode);
        let i = 0
        for (i = 0; i < list.length; i++) {
            if (list[i] === node) {
                break;
            }
        }
        return i; //这里是访问不到i的，所以i要声明到循环外面
    }
};