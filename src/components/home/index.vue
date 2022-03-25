<template>
  <div class="GridBox">
    <!-- 头部 -->
    <div class="header">
      <p>单路混合矩阵</p>
      <div class="rightHeader">
        <i class="el-icon-s-fold"></i>
        <i class="el-icon-s-tools"></i>
      </div>
    </div>

    <div class="content">
      <!-- 搜索-输入列表 -->
      <div class="left">
        <div class="SearchText">输入列表</div>
        <div class="Search">
          <div class="SearchBox">
            <el-input v-model="SearchInput" placeholder="">
              <i slot="suffix" class="el-input__icon el-icon-search"></i>
            </el-input>
          </div>
        </div>
      </div>

      <!-- 屏幕列表 -->
      <div class="center"></div>
      <!-- 场景列表 -->
      <div class="right"></div>
    </div>
  </div>
</template>

<script>
import { CardListApi, CardDetailApi, ginfo_syncApi } from "@/api/home";
export default {
  name: "Home",
  data() {
    // 初始化 输入卡列表
    let inList = new Map();
    for (let i = 1; i < 40; i++) {
      inList[i] = "";
    }

    // 初始化 GridArray
    const GridArray_item = {
      import: "", // 输入卡的名字
      importCh: "", // 输入卡的ID
      output: "", // 输出卡的名字
      outputCh: "", // 输出卡的ID
      handleClass: "", // 当前的背景色class    .out表示已经插入输出卡  .active 输入卡已经拖入输出卡位置
      singal_flagClass: "",
      hpd_link: "",
      card_type: "",
    };
    let GridArray = new Map();
    for (let i = 1; i < 33; i++) {
      GridArray.set(i, GridArray_item);
    }

    // 初始化 场景数值列表
    let pollNumList = new Map();
    for (let i = 1; i < 33; i++) {
      pollNumList.set(i, null);
    }

    // 初始化 视频预览列表
    let videoList = new Map();
    for (let i = 1; i < 5; i++) {
      videoList.set(i, {
        index: i,
        in: null,
      });
    }

    // 输入输出卡映射关系表
    let CardINOUTList = new Map();
    for (let i = 1; i < 65; i++) {
      CardINOUTList.set(i, Math.ceil(i / 2) + "_" + ((i + 1) % 2));
      // console.log(CardINOUTList.get(i));
    }

    return {
      // 输入卡列表
      inList,
      SearchInput: "12",
      // 空屏幕数据
      GridArray,
      // 场景数值列表
      pollNumList,
      // 分组列表
      GroupContext: [],
      // 当前分组
      gid: null,
      // 是否正在移动
      isMove: false,
      // 当前BOX的宽高以及xy
      inpW: 0,
      inpH: 0,
      inpX: 0,
      inpY: 0,
      boxEdit: null,
      acitveDom: null,
      flag: null,
      index: 9000,
      num: 0,
      // 视频预览列表
      videoList,
      // 卡板类型名字
      NameList: {
        1: "HDMI",
        17: "HDMI4K",
        65: "HDMI4K",
        49: "HDMI",
        100: "HDMI",
        101: "HDMI",
        102: "HDMI",
        3: "HDBT",
        51: "HDBT",
        2: "DVI",
        50: "DVI",
        5: "SDI",
        53: "SDI",
      },
      // 用户权限
      permit: null,
      // 当前活动窗体ID
      activeSID: "",
      // 映射关系里面有几个输出卡
      hasOutListLength: 0,
      // 是否手动调用场景
      isScene_call: false,
      // 是否web调用场景
      isWebSwitch: false,
      // 右键菜单显示状态
      contextMenuVisible: false,
      contextMenuTarget: document.body,
      // 场景截图数据
      dataurl: "",
      dataurlBolb: "",
      subCardNum: 16,
      ptn_grid_itemList: {
        16: "ptn-grid-item-4-4",
        32: "ptn-grid-item-4-8",
      },
      // 轮播图的index
      initial_index: 0,
      // 屏幕数量
      SencenNum: 1,
      // 板卡标识符列表
      cardTAGList: [],
      // 输入卡列表包含详情的
      cardImportListDetails: [],
      cardImportListDetailsCopy: {},
      // 正在拖动的输入板卡序号
      handleCh: "",
      handleChCopy: "",
      // 正在拖动的输入板卡的名字   rename或者板卡类型加上序号
      handleChName: "",
      // 正在托工的输入卡是否有信号
      handleSingal_flag: "",
      // 输出卡列表包含详情的
      cardOutputListDetails: [],
      cardOutputChList: [],
      // 弹窗
      dialog: {
        poll: {
          // 场景轮询弹窗数据
          visible: false,
          form: {
            Id_group: [],
            period: 10,
            en: 0, // 场景轮询开关   0关 1开
          },
        },
        scene: {
          visible: false,
          title: "",
          form: {
            sid: "",
            name: "",
            dataurl: "",
            sw: [],
          },
        },
        addpoll: {
          visible: false,
          title: "",
          form: {
            Scene_name: "",
            Id: "",
          },
        },
        dellAll: {
          visible: false,
          form: {
            Id: "",
          },
        },
      },
    };
  },

  components: {},

  mounted() {
    const _this = this;
    _this.getList();
    _this.getGroupContext();
  },

  methods: {
    // 选择分组时的点击事件
    handleClick(item) {
      console.log(item.gType, "当前分组类型");
      console.log(item.gID, "当前分组ID");
      console.log(item.Rows, "当前分组行数");
      console.log(item.Cols, "当前分组列数");
    },

    // 获取首屏数据
    async getList() {
      await CardListApi({ cmd: "LinkInfo" }).then((res) => {});
    },

    // 获取分组数据
    async getGroupContext() {
      await ginfo_syncApi({
        cmd: "ginfo_sync",
      }).then((res) => {
        this.GroupContext = res.ginfo_sync.context; // 分组列表
        this.gid = res.ginfo_sync.curr_grp; // 当前的分组ID
        let activeItem = this.GroupContext.filter(
          (item) => item.gID === this.gid
        );
        this.handleClick(activeItem[0]);
      });
    },

    // 输入列表插入逻辑
    inListInsert(index, item) {
      let i = index;
      if (this.inList[i]) {
        let i_port =
          this.inList[i].ch +
          "_" +
          `${
            this.inList[i].port_index === undefined
              ? 0
              : this.inList[i].port_index
          }`;
        let item_port =
          item.ch +
          "_" +
          `${item.port_index === undefined ? 0 : item.port_index}`;
        if (i_port === item_port) {
          // 如果 通道_端口 一样 则替换
          this.inList[i] = item;
        } else {
          this.inListInsert(i + 1, item);
        }
        console.log(i_port, "i_port");
        console.log(item_port, "item_port");
      } else {
        this.inList[i] = item;
        this.cardImportListDetailsCopy[i] = item;
      }
    },

    // 渲染栅格
    awaitPromise(item) {
      let _this = this;
      return new Promise((resolve, reject) => {
        CardDetailApi({ cmd: "CardInfo", cardIndex: item.ch }).then((i) => {
          if (
            i.list.card_type === 1 ||
            i.list.card_type === 3 ||
            i.list.card_type === 2 ||
            i.list.card_type === 5 ||
            i.list.card_type === 17
          ) {
            // 筛选输入卡   card_type 0未插卡/1输入卡/2输出卡(通用)
            // _this.cardImportListDetails.push(i.list)
            // _this.inList[i.list.ch] = i.list
            _this.inListInsert(i.list.ch, i.list);
          }
          if (i.list.card_type === 100) {
            // in out
            let port = i.list.port;
            port.forEach((iii) => {
              if (
                iii.port_type === 1 ||
                iii.port_type === 3 ||
                iii.port_type === 2 ||
                iii.port_type === 5 ||
                iii.port_type === 17
              ) {
                _this.inListInsert(iii.ch, iii);
              }
              if (
                iii.port_type === 49 ||
                iii.port_type === 51 ||
                iii.port_type === 50 ||
                iii.port_type === 53 ||
                iii.port_type === 65
              ) {
                _this.dispatchHttpOut(iii, 0, 1, true);
              }
            });
          }
          if (i.list.card_type === 101) {
            // in in
            let port = i.list.port;
            let portA = port[0];
            let portB = port[1];
            _this.inListInsert(i.list.ch, portA);
            _this.inListInsert(i.list.ch + 1, portB);
          }
          if (i.list.card_type === 102) {
            // out out
            let port = i.list.port;
            let portA = port[0];
            let portB = port[1];
            _this.dispatchHttpOut(portA, 0, 1, true);
            _this.dispatchHttpOut(portB, 1, 1, true);
          }
          if (
            i.list.card_type === 49 ||
            i.list.card_type === 51 ||
            i.list.card_type === 50 ||
            i.list.card_type === 53 ||
            i.list.card_type === 65
          ) {
            // 输出卡
            let data = i.list;
            _this.dispatchHttpOut(data, 0, 1, true);
          }
          resolve(true);
        });
      });
    },
  },
};
</script>
<style scoped lang="less">
.GridBox {
  box-sizing: border-box;
  display: grid;
  grid-template-rows: 1fr 15fr;
  color: #fff;
  font-size: 18px;

  .header {
    background: #2b2b2b;

    p {
      display: inline-block;
      padding-left: 50px;
    }

    .rightHeader {
      display: inline-block;
      font-size: 25px;
      position: absolute;
      right: 25px;
      top: 25px;

      i {
        padding-right: 30px;
      }
    }
  }

  .content {
    display: grid;
    grid-template-columns: 3fr 15fr 2fr;
    background: #1f1c1a;

    .left {
      display: grid;
      grid-template-rows: 1fr 18fr;

      .SearchText {
        font-size: 20px;
        text-align: center;
        line-height: 2.5;
      }
      .Search {
        display: grid;
        justify-content: center;
        padding-top: 10px;
        background: gray;

        .SearchBox {
          width: 180px;
          height: 40px;
          border-radius: 10px;
          background: #181818;

          .el-input {
            font-size: 18px;
            color: #333;

            i {
              border-left: 1px solid #c0c4cc;
            }
          }
        }
      }
    }
  }
}
</style>