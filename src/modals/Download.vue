<template>
  <div>
    <h3>Stream Temperature Model</h3>
    <p>
      The stream temperature model predictions are provided for a customized set of flowlines. Due
      to the size of this dataset
      it has been split into individual basins. Each shapefile contains
      the same attributes.
    </p>
    <img
      src="../assets/img/download/streamtemp-map.png"
      alt="Stream Temperature Map"
      width="650px">
    <h4>Download Entire Dataset</h4>
    <ul>
      <li><a href="./data/download/streamtemp/streamtemp-cce.zip" download>Crown of the Continent Ecosystem (419 mb)</a></li>
    </ul>
    <h4>Download By HUC8 Basin</h4>
    <ul>
      <li><a href="./data/download/streamtemp/streamtemp-511.zip" download>511 - Upper Oldman River - Crowsnest Pass (22 mb)</a></li>
      <li><a href="./data/download/streamtemp/streamtemp-512.zip" download>512 - Willow Creek (7.9 mb)</a></li>
      <li><a href="./data/download/streamtemp/streamtemp-513.zip" download>513 - Lttle Bow River (690 mb)</a></li>
      <li><a href="./data/download/streamtemp/streamtemp-516.zip" download>516 - Etzikom Coulee-Pakowki Lake (1.5 mb)</a></li>
      <li><a href="./data/download/streamtemp/streamtemp-526.zip" download>526 - Kananaskis River and Lake (1.1 mb)</a></li>
      <li><a href="./data/download/streamtemp/streamtemp-532.zip" download>532 - Sheep - Highwood River (4.1 mb)</a></li>
      <li><a href="./data/download/streamtemp/streamtemp-9040001.zip" download>9040001 - St. Mary River (20 mb)</a></li>
      <li><a href="./data/download/streamtemp/streamtemp-9040002.zip" download>9040002 - Waterton River (14 mb)</a></li>
      <li><a href="./data/download/streamtemp/streamtemp-10030101.zip" download>10030101 - Upper Missouri (6.1 mb)</a></li>
      <li><a href="./data/download/streamtemp/streamtemp-10030102.zip" download>10030102 - Upper Missouri-Dearborn (11 mb)</a></li>
      <li><a href="./data/download/streamtemp/streamtemp-10030104.zip" download>10030104 - Sun (21 mb)</a></li>
      <li><a href="./data/download/streamtemp/streamtemp-10030201.zip" download>10030201 - Two Medicine (18 mb)</a></li>
      <li><a href="./data/download/streamtemp/streamtemp-10030202.zip" download>10030202 - Cut Bank (11 mb)</a></li>
      <li><a href="./data/download/streamtemp/streamtemp-10030203.zip" download>10030203 - Marias (3.6 mb)</a></li>
      <li><a href="./data/download/streamtemp/streamtemp-10030205.zip" download>10030205 - Teton (14 mb)</a></li>
      <li><a href="./data/download/streamtemp/streamtemp-10050001.zip" download>10050001 - Elk (10 mb)</a></li>
      <li><a href="./data/download/streamtemp/streamtemp-17010101.zip" download>17010101 - Middle Kootenai (94 mb)</a></li>
      <li><a href="./data/download/streamtemp/streamtemp-17010203.zip" download>17010203 - Blackfoot (31 mb)</a></li>
      <li><a href="./data/download/streamtemp/streamtemp-17010206.zip" download>17010206 - North Fork Flathead (29 mb)</a></li>
      <li><a href="./data/download/streamtemp/streamtemp-17010207.zip" download>17010207 - Middle Fork Flathead (18 mb)</a></li>
      <li><a href="./data/download/streamtemp/streamtemp-17010208.zip" download>17010208 - Flathead Lake (11 mb)</a></li>
      <li><a href="./data/download/streamtemp/streamtemp-17010209.zip" download>17010209 - South Fork Flathead (20 mb)</a></li>
      <li><a href="./data/download/streamtemp/streamtemp-17010210.zip" download>17010210 - Stillwater (9.6 mb)</a></li>
      <li><a href="./data/download/streamtemp/streamtemp-17010211.zip" download>17010211 - Swan (9.1 mb)</a></li>
      <li><a href="./data/download/streamtemp/streamtemp-17010212.zip" download>17010212 - Lower Flathead (30 mb)</a></li>
    </ul>
    <h4>Shapefile Attributes</h4>
    <p>
      Each shapefile provides mean monthly stream temperatures from April through November for the
      historical baseline (1985-2005), and two climate change scenarios (RCP 4.5 and 8.5) for two
      future years (2035 and 2075).
    </p>
    <p>
      The historical baseline temperatures are provided in attributes named <i>tsM_base</i> where
      <i>M</i> is the month.
    </p>
    <p>
      The future climate change scenario temperatures are provided in attributes named
      <i>tsM_XX_YY</i> for month <i>M</i>, scenario <i>XX</i> and year <i>YY</i>.
    </p>
    <p>
      Each shapefile also includes an ID attribute named <i>gid</i> that is unique for each stream
      segment.
    </p>
    <table class="table table-condensed table-striped" style="width:100%">
      <thead>
        <tr>
          <th class="col-md-3">Attribute</th>
          <th class="col-md-3">Month</th>
          <th class="col-md-3">Scenario</th>
          <th class="col-md-3">Time Period</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="col-md-3">ts4_base</td>
          <td class="col-md-3">April</td>
          <td class="col-md-3">Historical Baseline</td>
          <td class="col-md-3">1985-2005</td>
        </tr>
        <tr>
          <td class="col-md-3">ts4_45_35</td>
          <td class="col-md-3">April</td>
          <td class="col-md-3">RCP 4.5</td>
          <td class="col-md-3">2035</td>
        </tr>
        <tr>
          <td class="col-md-3">ts4_45_75</td>
          <td class="col-md-3">April</td>
          <td class="col-md-3">RCP 4.5</td>
          <td class="col-md-3">2075</td>
        </tr>
        <tr>
          <td class="col-md-3">ts4_85_35</td>
          <td class="col-md-3">April</td>
          <td class="col-md-3">RCP 8.5</td>
          <td class="col-md-3">2035</td>
        </tr>
        <tr>
          <td class="col-md-3">ts4_85_75</td>
          <td class="col-md-3">April</td>
          <td class="col-md-3">RCP 8.5</td>
          <td class="col-md-3">2075</td>
        </tr>
        <tr>
          <td class="col-md-3">ts5_base</td>
          <td class="col-md-3">May</td>
          <td class="col-md-3">Historical Baseline</td>
          <td class="col-md-3">1985-2005</td>
        </tr>
        <tr>
          <td class="col-md-3">ts5_45_35</td>
          <td class="col-md-3">May</td>
          <td class="col-md-3">RCP 4.5</td>
          <td class="col-md-3">2035</td>
        </tr>
        <tr>
          <td class="col-md-3">ts5_45_75</td>
          <td class="col-md-3">May</td>
          <td class="col-md-3">RCP 4.5</td>
          <td class="col-md-3">2075</td>
        </tr>
        <tr>
          <td class="col-md-3">ts5_85_35</td>
          <td class="col-md-3">May</td>
          <td class="col-md-3">RCP 8.5</td>
          <td class="col-md-3">2035</td>
        </tr>
        <tr>
          <td class="col-md-3">ts5_85_75</td>
          <td class="col-md-3">May</td>
          <td class="col-md-3">RCP 8.5</td>
          <td class="col-md-3">2075</td>
        </tr>
        <tr>
          <td class="col-md-3">ts6_base</td>
          <td class="col-md-3">June</td>
          <td class="col-md-3">Historical Baseline</td>
          <td class="col-md-3">1985-2005</td>
        </tr>
        <tr>
          <td class="col-md-3">ts6_45_35</td>
          <td class="col-md-3">June</td>
          <td class="col-md-3">RCP 4.5</td>
          <td class="col-md-3">2035</td>
        </tr>
        <tr>
          <td class="col-md-3">ts6_45_75</td>
          <td class="col-md-3">June</td>
          <td class="col-md-3">RCP 4.5</td>
          <td class="col-md-3">2075</td>
        </tr>
        <tr>
          <td class="col-md-3">ts6_85_35</td>
          <td class="col-md-3">June</td>
          <td class="col-md-3">RCP 8.5</td>
          <td class="col-md-3">2035</td>
        </tr>
        <tr>
          <td class="col-md-3">ts6_85_75</td>
          <td class="col-md-3">June</td>
          <td class="col-md-3">RCP 8.5</td>
          <td class="col-md-3">2075</td>
        </tr>
        <tr>
          <td class="col-md-3">ts7_base</td>
          <td class="col-md-3">July</td>
          <td class="col-md-3">Historical Baseline</td>
          <td class="col-md-3">1985-2005</td>
        </tr>
        <tr>
          <td class="col-md-3">ts7_45_35</td>
          <td class="col-md-3">July</td>
          <td class="col-md-3">RCP 4.5</td>
          <td class="col-md-3">2035</td>
        </tr>
        <tr>
          <td class="col-md-3">ts7_45_75</td>
          <td class="col-md-3">July</td>
          <td class="col-md-3">RCP 4.5</td>
          <td class="col-md-3">2075</td>
        </tr>
        <tr>
          <td class="col-md-3">ts7_85_35</td>
          <td class="col-md-3">July</td>
          <td class="col-md-3">RCP 8.5</td>
          <td class="col-md-3">2035</td>
        </tr>
        <tr>
          <td class="col-md-3">ts7_85_75</td>
          <td class="col-md-3">July</td>
          <td class="col-md-3">RCP 8.5</td>
          <td class="col-md-3">2075</td>
        </tr>
        <tr>
          <td class="col-md-3">ts8_base</td>
          <td class="col-md-3">August</td>
          <td class="col-md-3">Historical Baseline</td>
          <td class="col-md-3">1985-2005</td>
        </tr>
        <tr>
          <td class="col-md-3">ts8_45_35</td>
          <td class="col-md-3">August</td>
          <td class="col-md-3">RCP 4.5</td>
          <td class="col-md-3">2035</td>
        </tr>
        <tr>
          <td class="col-md-3">ts8_45_75</td>
          <td class="col-md-3">August</td>
          <td class="col-md-3">RCP 4.5</td>
          <td class="col-md-3">2075</td>
        </tr>
        <tr>
          <td class="col-md-3">ts8_85_35</td>
          <td class="col-md-3">August</td>
          <td class="col-md-3">RCP 8.5</td>
          <td class="col-md-3">2035</td>
        </tr>
        <tr>
          <td class="col-md-3">ts8_85_75</td>
          <td class="col-md-3">August</td>
          <td class="col-md-3">RCP 8.5</td>
          <td class="col-md-3">2075</td>
        </tr>
        <tr>
          <td class="col-md-3">ts9_base</td>
          <td class="col-md-3">September</td>
          <td class="col-md-3">Historical Baseline</td>
          <td class="col-md-3">1985-2005</td>
        </tr>
        <tr>
          <td class="col-md-3">ts9_45_35</td>
          <td class="col-md-3">September</td>
          <td class="col-md-3">RCP 4.5</td>
          <td class="col-md-3">2035</td>
        </tr>
        <tr>
          <td class="col-md-3">ts9_45_75</td>
          <td class="col-md-3">September</td>
          <td class="col-md-3">RCP 4.5</td>
          <td class="col-md-3">2075</td>
        </tr>
        <tr>
          <td class="col-md-3">ts9_85_35</td>
          <td class="col-md-3">September</td>
          <td class="col-md-3">RCP 8.5</td>
          <td class="col-md-3">2035</td>
        </tr>
        <tr>
          <td class="col-md-3">ts9_85_75</td>
          <td class="col-md-3">September</td>
          <td class="col-md-3">RCP 8.5</td>
          <td class="col-md-3">2075</td>
        </tr>
        <tr>
          <td class="col-md-3">ts10_base</td>
          <td class="col-md-3">October</td>
          <td class="col-md-3">Historical Baseline</td>
          <td class="col-md-3">1985-2005</td>
        </tr>
        <tr>
          <td class="col-md-3">ts10_45_35</td>
          <td class="col-md-3">October</td>
          <td class="col-md-3">RCP 4.5</td>
          <td class="col-md-3">2035</td>
        </tr>
        <tr>
          <td class="col-md-3">ts10_45_75</td>
          <td class="col-md-3">October</td>
          <td class="col-md-3">RCP 4.5</td>
          <td class="col-md-3">2075</td>
        </tr>
        <tr>
          <td class="col-md-3">ts10_85_35</td>
          <td class="col-md-3">October</td>
          <td class="col-md-3">RCP 8.5</td>
          <td class="col-md-3">2035</td>
        </tr>
        <tr>
          <td class="col-md-3">ts10_85_75</td>
          <td class="col-md-3">October</td>
          <td class="col-md-3">RCP 8.5</td>
          <td class="col-md-3">2075</td>
        </tr>
        <tr>
          <td class="col-md-3">ts11_base</td>
          <td class="col-md-3">November</td>
          <td class="col-md-3">Historical Baseline</td>
          <td class="col-md-3">1985-2005</td>
        </tr>
        <tr>
          <td class="col-md-3">ts11_45_35</td>
          <td class="col-md-3">November</td>
          <td class="col-md-3">RCP 4.5</td>
          <td class="col-md-3">2035</td>
        </tr>
        <tr>
          <td class="col-md-3">ts11_45_75</td>
          <td class="col-md-3">November</td>
          <td class="col-md-3">RCP 4.5</td>
          <td class="col-md-3">2075</td>
        </tr>
        <tr>
          <td class="col-md-3">ts11_85_35</td>
          <td class="col-md-3">November</td>
          <td class="col-md-3">RCP 8.5</td>
          <td class="col-md-3">2035</td>
        </tr>
        <tr>
          <td class="col-md-3">ts11_85_75</td>
          <td class="col-md-3">November</td>
          <td class="col-md-3">RCP 8.5</td>
          <td class="col-md-3">2075</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
