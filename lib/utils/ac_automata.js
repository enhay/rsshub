
class ACNode {
  constructor(data) {
    this.data = data;
    this.children = new Map();
    this.isEndingChar = false;
    this.rawData = '';
    this.length = 0;
    this.fail = null;
  }
}

class ACTree {
  // 初始化并
  constructor(data) {
    this.root = new ACNode('/');
    data.forEach((item) => {
      this.insert(item);
    });
    this.buildFailurePointer();
  }

  insert(text) {
    let node = this.root;
    for (const char of text) {
      if (!node.children.get(char)) {
        node.children.set(char, new ACNode(char));
      }
      node = node.children.get(char);
    }

    node.isEndingChar = true;
    node.rawData = text;
    node.length = text.length;
  }

  buildFailurePointer() {
    const root = this.root;
    const queue = [];
    queue.push(root);

    while (queue.length > 0) {
      const p = queue.shift();

      for (let pc of p.children.values()) {
        if (!pc) {
          continue;
        }

        if (p == root) {
          pc.fail = root;
        } else {
          let q = p.fail;
          while (q) {
            const qc = q.children.get(pc.data);
            if (qc) {
              pc.fail = qc;
              break;
            }
            q = q.fail;
          }
          if (!q) {
            pc.fail = root;
          }
        }
        queue.push(pc);
      }
    }
  }

  match(text) {
    const matchResult = [];
    const root = this.root;
    const n = text.length;
    let p = root;

    for (let i = 0; i < n; i++) {
      const char = text[i];
      while (!p.children.get(char) && p != root) {
        p = p.fail;
      }

      p = p.children.get(char);
      if (!p) {
        p = root;
      }

      let tmp = p;
      while (tmp != root) {
        if (tmp.isEndingChar == true) {
          matchResult.push(tmp.rawData);
        }
        tmp = tmp.fail;
      }
    }
    return matchResult;
  }
}

// function match(text, patterns) {
//   const automata = new ACTree(patterns);
//   const result = automata.match(text);
//   return result;
// }

// const patterns2 = ["Fxtec Pro1", "谷歌Pixel"];
// const text2 = "一家总部位于伦敦的公司Fxtex在MWC上就推出了一款名为Fxtec Pro1的手机，该机最大的亮点就是采用了侧滑式全键盘设计。DxOMark年度总榜发布 华为P20 Pro/谷歌Pixel 3争冠";
// console.log(match(text2, patterns2));
module.exports = ACTree;