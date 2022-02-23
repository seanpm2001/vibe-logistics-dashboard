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
