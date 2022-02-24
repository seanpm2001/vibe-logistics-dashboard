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


export const USfreightEunm={
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
}

export const CAfreightEnum={
    BC:{
      B55:{
        TRUCK:{
          nitialPrice:100,
          unitPrice=200,
          tenUnitPrice=200
        },
        Amazon:{
          nitialPrice:0,
          unitPrice=360,
          tenUnitPrice=360
        }
      },
      S55:{
        TRUCK:{
          nitialPrice:40,
          unitPrice=110,
          tenUnitPrice=110
        },
        Amazon:{
          nitialPrice:40,
          unitPrice=110,
          tenUnitPrice=110
        }
      },
      BS55:{
        TRUCK:{
          nitialPrice:130,
          unitPrice=220,
          tenUnitPrice=220
        },
        Amazon:{
          nitialPrice:0,
          unitPrice=410,
          tenUnitPrice=410
        }
      },
      B75:{
        TRUCK:{
          nitialPrice:170,
          unitPrice=280,
          tenUnitPrice=280
        }
      },
      BS75:{
        TRUCK:{
          nitialPrice:220,
          unitPrice=330,
          tenUnitPrice=330
        }
      },
    },
    AB:{
      B55:{
        TRUCK:{
          nitialPrice:50,
          unitPrice=100,
          tenUnitPrice=100
        },
        Amazon:{
          nitialPrice:0,
          unitPrice=180,
          tenUnitPrice=180
        }
      },
      S55:{
        TRUCK:{
          nitialPrice:20,
          unitPrice=60,
          tenUnitPrice=60
        },
        Amazon:{
          nitialPrice:20,
          unitPrice=60,
          tenUnitPrice=60
        }
      },
      BS55:{
        TRUCK:{
          nitialPrice:50,
          unitPrice=150,
          tenUnitPrice=150
        },
        Amazon:{
          nitialPrice:0,
          unitPrice=230,
          tenUnitPrice=230
        }
      },
      B75:{
        TRUCK:{
          nitialPrice:70,
          unitPrice=180,
          tenUnitPrice=180
        }
      },
      BS75:{
        TRUCK:{
          nitialPrice:100,
          unitPrice=200,
          tenUnitPrice=200
        }
      },
    },
    SK:{'B55': {'TRUCK': {'nitialPrice': 70, 'unitPrice': 180, 'tenUnitPrice': 180}, 'Amazon': {'nitialPrice': 0, 'unitPrice': 300, 'tenUnitPrice': 300}}, 'S55': {'TRUCK': {'nitialPrice': 30, 'unitPrice': 90, 'tenUnitPrice': 90}, 'Amazon': {'nitialPrice': 30, 'unitPrice': 90, 'tenUnitPrice': 90}}, 'BS55': {'TRUCK': {'nitialPrice': 100, 'unitPrice': 200, 'tenUnitPrice': 200}, 'Amazon': {'nitialPrice': 0, 'unitPrice': 350, 'tenUnitPrice': 350}}, 'B75': {'TRUCK': {'nitialPrice': 150, 'unitPrice': 250, 'tenUnitPrice': 250}}, 'BS75': {'TRUCK': {'nitialPrice': 170, 'unitPrice': 280, 'tenUnitPrice': 280}}},
    MB:{'B55': {'TRUCK': {'nitialPrice': 100, 'unitPrice': 200, 'tenUnitPrice': 200}, 'Amazon': {'nitialPrice': 0, 'unitPrice': 360, 'tenUnitPrice': 360}}, 'S55': {'TRUCK': {'nitialPrice': 139, 'unitPrice': 110, 'tenUnitPrice': 110}, 'Amazon': {'nitialPrice': 139, 'unitPrice': 110, 'tenUnitPrice': 110}}, 'BS55': {'TRUCK': {'nitialPrice': 130, 'unitPrice': 220, 'tenUnitPrice': 220}, 'Amazon': {'nitialPrice': 0, 'unitPrice': 350, 'tenUnitPrice': 350}}, 'B75': {'TRUCK': {'nitialPrice': 170, 'unitPrice': 280, 'tenUnitPrice': 280}}, 'BS75': {'TRUCK': {'nitialPrice': 220, 'unitPrice': 330, 'tenUnitPrice': 330}}},
    NL:{'B55': {'TRUCK': {'nitialPrice': 200, 'unitPrice': 300, 'tenUnitPrice': 300}, 'Amazon': {'nitialPrice': 0, 'unitPrice': 600, 'tenUnitPrice': 600}}, 'S55': {'TRUCK': {'nitialPrice': 185, 'unitPrice': 150, 'tenUnitPrice': 150}, 'Amazon': {'nitialPrice': 185, 'unitPrice': 150, 'tenUnitPrice': 150}}, 'BS55': {'TRUCK': {'nitialPrice': 250, 'unitPrice': 350, 'tenUnitPrice': 350}, 'Amazon': {'nitialPrice': 0, 'unitPrice': 700, 'tenUnitPrice': 700}}, 'B75': {'TRUCK': {'nitialPrice': 320, 'unitPrice': 430, 'tenUnitPrice': 430}}, 'BS75': {'TRUCK': {'nitialPrice': 300, 'unitPrice': 600, 'tenUnitPrice': 600}}},
    NS:{'B55': {'TRUCK': {'nitialPrice': 200, 'unitPrice': 300, 'tenUnitPrice': 300}, 'Amazon': {'nitialPrice': 0, 'unitPrice': 600, 'tenUnitPrice': 600}}, 'S55': {'TRUCK': {'nitialPrice': 185, 'unitPrice': 150, 'tenUnitPrice': 150}, 'Amazon': {'nitialPrice': 185, 'unitPrice': 150, 'tenUnitPrice': 150}}, 'BS55': {'TRUCK': {'nitialPrice': 250, 'unitPrice': 350, 'tenUnitPrice': 350}, 'Amazon': {'nitialPrice': 0, 'unitPrice': 700, 'tenUnitPrice': 700}}, 'B75': {'TRUCK': {'nitialPrice': 320, 'unitPrice': 430, 'tenUnitPrice': 430}}, 'BS75': {'TRUCK': {'nitialPrice': 300, 'unitPrice': 600, 'tenUnitPrice': 600}}},
    PE:{'B55': {'TRUCK': {'nitialPrice': 250, 'unitPrice': 350, 'tenUnitPrice': 350}, 'Amazon': {'nitialPrice': 0, 'unitPrice': 720, 'tenUnitPrice': 720}}, 'S55': {'TRUCK': {'nitialPrice': 233, 'unitPrice': 170, 'tenUnitPrice': 170}, 'Amazon': {'nitialPrice': 233, 'unitPrice': 170, 'tenUnitPrice': 170}}, 'BS55': {'TRUCK': {'nitialPrice': 300, 'unitPrice': 400, 'tenUnitPrice': 400}, 'Amazon': {'nitialPrice': 0, 'unitPrice': 820, 'tenUnitPrice': 820}}, 'B75': {'TRUCK': {'nitialPrice': 300, 'unitPrice': 600, 'tenUnitPrice': 600}}, 'BS75': {'TRUCK': {'nitialPrice': 300, 'unitPrice': 750, 'tenUnitPrice': 750}}},
    NB:{'B55': {'TRUCK': {'nitialPrice': 200, 'unitPrice': 300, 'tenUnitPrice': 300}, 'Amazon': {'nitialPrice': 0, 'unitPrice': 600, 'tenUnitPrice': 600}}, 'S55': {'TRUCK': {'nitialPrice': 185, 'unitPrice': 150, 'tenUnitPrice': 150}, 'Amazon': {'nitialPrice': 185, 'unitPrice': 150, 'tenUnitPrice': 150}}, 'BS55': {'TRUCK': {'nitialPrice': 250, 'unitPrice': 350, 'tenUnitPrice': 350}, 'Amazon': {'nitialPrice': 0, 'unitPrice': 700, 'tenUnitPrice': 700}}, 'B75': {'TRUCK': {'nitialPrice': 320, 'unitPrice': 430, 'tenUnitPrice': 430}}, 'BS75': {'TRUCK': {'nitialPrice': 300, 'unitPrice': 600, 'tenUnitPrice': 600}}},
    ON:{'B55': {'TRUCK': {'nitialPrice': 130, 'unitPrice': 220, 'tenUnitPrice': 220}, 'Amazon': {'nitialPrice': 0, 'unitPrice': 420, 'tenUnitPrice': 420}}, 'S55': {'TRUCK': {'nitialPrice': 148, 'unitPrice': 120, 'tenUnitPrice': 120}, 'Amazon': {'nitialPrice': 148, 'unitPrice': 120, 'tenUnitPrice': 120}}, 'BS55': {'TRUCK': {'nitialPrice': 150, 'unitPrice': 250, 'tenUnitPrice': 250}, 'Amazon': {'nitialPrice': 0, 'unitPrice': 470, 'tenUnitPrice': 470}}, 'B75': {'TRUCK': {'nitialPrice': 220, 'unitPrice': 330, 'tenUnitPrice': 330}}, 'BS75': {'TRUCK': {'nitialPrice': 250, 'unitPrice': 350, 'tenUnitPrice': 350}}},
    QC:{'B55': {'TRUCK': {'nitialPrice': 150, 'unitPrice': 250, 'tenUnitPrice': 250}, 'Amazon': {'nitialPrice': 0, 'unitPrice': 480, 'tenUnitPrice': 480}}, 'S55': {'TRUCK': {'nitialPrice': 167, 'unitPrice': 130, 'tenUnitPrice': 130}, 'Amazon': {'nitialPrice': 167, 'unitPrice': 130, 'tenUnitPrice': 130}}, 'BS55': {'TRUCK': {'nitialPrice': 170, 'unitPrice': 280, 'tenUnitPrice': 280}, 'Amazon': {'nitialPrice': 0, 'unitPrice': 530, 'tenUnitPrice': 530}}, 'B75': {'TRUCK': {'nitialPrice': 250, 'unitPrice': 350, 'tenUnitPrice': 350}}, 'BS75': {'TRUCK': {'nitialPrice': 300, 'unitPrice': 400, 'tenUnitPrice': 400}}},
    NT:{'B55': {'TRUCK': {'nitialPrice': 200, 'unitPrice': 300, 'tenUnitPrice': 300}, 'Amazon': {'nitialPrice': 0, 'unitPrice': 600, 'tenUnitPrice': 600}}, 'S55': {'TRUCK': {'nitialPrice': 185, 'unitPrice': 150, 'tenUnitPrice': 150}, 'Amazon': {'nitialPrice': 185, 'unitPrice': 150, 'tenUnitPrice': 150}}, 'BS55': {'TRUCK': {'nitialPrice': 250, 'unitPrice': 350, 'tenUnitPrice': 350}, 'Amazon': {'nitialPrice': 0, 'unitPrice': 700, 'tenUnitPrice': 700}}, 'B75': {'TRUCK': {'nitialPrice': 320, 'unitPrice': 430, 'tenUnitPrice': 430}}, 'BS75': {'TRUCK': {'nitialPrice': 300, 'unitPrice': 600, 'tenUnitPrice': 600}}},
    YT:{'B55': {'TRUCK': {'nitialPrice': 200, 'unitPrice': 300, 'tenUnitPrice': 300}, 'Amazon': {'nitialPrice': 0, 'unitPrice': 600, 'tenUnitPrice': 600}}, 'S55': {'TRUCK': {'nitialPrice': 185, 'unitPrice': 150, 'tenUnitPrice': 150}, 'Amazon': {'nitialPrice': 185, 'unitPrice': 150, 'tenUnitPrice': 150}}, 'BS55': {'TRUCK': {'nitialPrice': 250, 'unitPrice': 350, 'tenUnitPrice': 350}, 'Amazon': {'nitialPrice': 0, 'unitPrice': 700, 'tenUnitPrice': 700}}, 'B75': {'TRUCK': {'nitialPrice': 320, 'unitPrice': 430, 'tenUnitPrice': 430}}, 'BS75': {'TRUCK': {'nitialPrice': 300, 'unitPrice': 600, 'tenUnitPrice': 600}}},
    NU:{'B55': {'TRUCK': {'nitialPrice': 200, 'unitPrice': 300, 'tenUnitPrice': 300}, 'Amazon': {'nitialPrice': 0, 'unitPrice': 600, 'tenUnitPrice': 600}}, 'S55': {'TRUCK': {'nitialPrice': 185, 'unitPrice': 150, 'tenUnitPrice': 150}, 'Amazon': {'nitialPrice': 185, 'unitPrice': 150, 'tenUnitPrice': 150}}, 'BS55': {'TRUCK': {'nitialPrice': 250, 'unitPrice': 350, 'tenUnitPrice': 350}, 'Amazon': {'nitialPrice': 0, 'unitPrice': 700, 'tenUnitPrice': 700}}, 'B75': {'TRUCK': {'nitialPrice': 320, 'unitPrice': 430, 'tenUnitPrice': 430}}, 'BS75': {'TRUCK': {'nitialPrice': 300, 'unitPrice': 600, 'tenUnitPrice': 600}}},
}


export const USCostFuc=(nation,position,way,number)=>{
  

}