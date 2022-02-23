export const USCostEnum = {
  WEST: {
    55: {
      BOARD: {
        TRUCK: num => num < 10 ? 260 + num * 90 : 1160 + (num-10) * 60,
        GLS: num => num < 10 ? 70 + num * 100 : 1070 + (num-10) * 60,
      },
      STAND: {
        TRUCK: 0,
        FEDEX: 0,
      },
      SET: {

      }
    },
    75: {
    }
  },
  MIDDLE: {

  },
  EAST: {

  },
  AK: {},
  HI: {},
  PR: {},
};

export const CACostEnum = {
  AB: {
    55: {
      BOARD: {
        TRUCK: num => 50 + num * 100,
        FEDEX: num => 0,
      },
      STAND: {
        TRUCK: 0,
        FEDEX: 0,
      },
      SET: {

      }
    },
    75: {
    }
  },
  BC: {
    55: {
      BOARD: {
        TRUCK: num => 100 + num * 200,
        FEDEX: num => 0,
      },
      STAND: {
        TRUCK: num => 40 + num * 110,
        FEDEX: num => 40 + num * 110,
      },
      SET: {

      }
    },
    75: {
    }
  },
  MB: { 
    55: {
      BOARD: {
        TRUCK: num => 100 + num * 200,
        FEDEX: num => 0,
      },
      STAND: {
        TRUCK: num => 0,
        FEDEX: num => 0,
      },
      SET: {

      }
    },
    75: {
    }
  },
  NB: {
    55: {
      BOARD: {
        TRUCK: num => 200 + num * 300,
        FEDEX: num => 0,
      },
      STAND: {
        TRUCK: num => 0,
        FEDEX: num => 0,
      },
      SET: {

      }
    },
    75: {
    }
  },
  NL: {
    55: {
      BOARD: {
        TRUCK: num => 200 + num * 300,
        FEDEX: num => 0,
      },
      STAND: {
        TRUCK: num => 0,
        FEDEX: num => 0,
      },
      SET: {

      }
    },
    75: {
    }
  },
  NS: {
    55: {
      BOARD: {
        TRUCK: num => 200 + num * 300,
        FEDEX: num => 0,
      },
      STAND: {
        TRUCK: num => 0,
        FEDEX: num => 0,
      },
      SET: {

      }
    },
    75: {
    }
  },
  NT: {
    55: {
      BOARD: {
        TRUCK: num => 200 + num * 300,
        FEDEX: num => 0,
      },
      STAND: {
        TRUCK: num => 0,
        FEDEX: num => 0,
      },
      SET: {

      }
    },
    75: {
    }
  },
  NU: {
    55: {
      BOARD: {
        TRUCK: num => 200 + num * 300,
        FEDEX: num => 0,
      },
      STAND: {
        TRUCK: num => 0,
        FEDEX: num => 0,
      },
      SET: {

      }
    },
    75: {
    }
  },
  ON: {
    55: {
      BOARD: {
        TRUCK: num => 130 + num * 220,
        FEDEX: num => 0,
      },
      STAND: {
        TRUCK: num => 0,
        FEDEX: num => 0,
      },
      SET: {

      }
    },
    75: {
    }
  },
  PE: {
    55: {
      BOARD: {
        TRUCK: num => 250 + num * 350,
        FEDEX: num => 0,
      },
      STAND: {
        TRUCK: num => 0,
        FEDEX: num => 0,
      },
      SET: {

      }
    },
    75: {
    }
  },
  QC: {
    55: {
      BOARD: {
        TRUCK: num => 150 + num * 250,
        FEDEX: num => 0,
      },
      STAND: {
        TRUCK: num => 0,
        FEDEX: num => 0,
      },
      SET: {

      }
    },
    75: {
    }
  },
  SK: {
    55: {
      BOARD: {
        TRUCK: num => 70 + num * 180,
        FEDEX: num => 0,
      },
      STAND: {
        TRUCK: num => 0,
        FEDEX: num => 0,
      },
      SET: {

      }
    },
    75: {
    }
  },
  YT: {
    55: {
      BOARD: {
        TRUCK: num => 200 + num * 300,
        FEDEX: num => 0,
      },
      STAND: {
        TRUCK: num => 0,
        FEDEX: num => 0,
      },
      SET: {

      }
    },
    75: {
    }
  }
};

export const CostEnum={
  US:{
    B55:{
      WEST:{
        GLS:{
          nitialPrice:70,
          unitPrice=100,
          tenUnitPrice=60
        },
        TRUCK:{
          nitialPrice:260,
          unitPrice=90,
          tenUnitPrice=60
        }
      },
      MIDDLE:{
        TRUCK:{
          nitialPrice:300,
          unitPrice=100,
          tenUnitPrice=70
        }
      },
      EAST:{
        TRUCK:{
          nitialPrice:340,
          unitPrice=110,
          tenUnitPrice=80
        }
      },
      AK:{
        TRUCK:{
          nitialPrice:450,
          unitPrice=150,
          tenUnitPrice=80
        }
      },
      HI:{
        CLC:{
          nitialPrice:600,
          unitPrice=200,
          tenUnitPrice=120
        }
      },
      PR:{
        UPS:{
          nitialPrice:0,
          unitPrice=350,
          tenUnitPrice=350
        }
      }

    },
    BS55:{
      WEST:{
        GLS:{
          nitialPrice:110,
          unitPrice=160,
          tenUnitPrice=100
        },
        TRUCK:{
          nitialPrice:280,
          unitPrice=120,
          tenUnitPrice=100
        }
      },
      MIDDLE:{
        TRUCK:{
          nitialPrice:310,
          unitPrice=120,
          tenUnitPrice=100
        }
      },
      EAST:{
        TRUCK:{
          nitialPrice:340,
          unitPrice=160,
          tenUnitPrice=140
        }
      },
      AK:{
        TRUCK:{
          nitialPrice:500,
          unitPrice=200,
          tenUnitPrice=180
        }
      },
      HI:{
        CLC:{
          nitialPrice:650,
          unitPrice=250,
          tenUnitPrice=220
        }
      },
      PR:{
        UPS:{
          nitialPrice:0,
          unitPrice=375,
          tenUnitPrice=375
        }
      }
      
    },
    S55:{
      WEST:{
        TRUCK:{
          nitialPrice:190,
          unitPrice=60,
          tenUnitPrice=50
        }
      },
      MIDDLE:{
        TRUCK:{
          nitialPrice:230,
          unitPrice=70,
          tenUnitPrice=60
        }
      },
      EAST:{
        TRUCK:{
          nitialPrice:270,
          unitPrice=80,
          tenUnitPrice=70
        }
      },
      AK:{
        TRUCK:{
          nitialPrice:300,
          unitPrice=100,
          tenUnitPrice=90
        }
      },
      HI:{
        CLC:{
          nitialPrice:380,
          unitPrice=120,
          tenUnitPrice=110
        }
      },
      PR:{
        UPS:{
          nitialPrice:0,
          unitPrice=375,
          tenUnitPrice=375
        }
      }
    },
    B75:{
    },
    BS75:{
    }
  },
  CA:{
    BC:{

    },
    AB:{

    },
    SK:{

    },
    BC:{

    },
    MB:{

    },
    NL:{

    },
    NS:{

    },
    PR:{

    },
    NB:{

    },
    ON:{

    },
    QC:{

    },
    NT:{

    },
    YT:{

    },
    NU:{

    },
  }
}


export const USCostFuc=(position,way,number)=>{
  /** 初始价格 */
  let nitialPrice=0
  /** 单价 */
  let unitPrice=0
  switch(position){
    case "WEST":
      if (way=="GLS"){
        if (number<=10){
          nitialPrice=70
          unitPrice=100
        } else {
          nitialPrice=1070
          unitPrice=60
          number-=10
        }
      } else {
        // way == Truck
        if (number<=10){
          nitialPrice=260
          unitPrice=90
        } else {
          nitialPrice=1070
          unitPrice=60
          number-=10
        }
      }
      
      
      break
    case "MIDDLE":
      break
    case "EAST":
      break
    case "AK":
      break
    case "HI":
      break
    case "PR":
      break
    
  }

}