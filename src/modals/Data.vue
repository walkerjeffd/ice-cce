<template>
  <div>
    <h3>Overview</h3>
    <p>
      This application presents a Vulnerability Assessment for Westslope Cutthroat Trout and
      Bull Trout in the Crown of the Continent Ecosystem (CCE).
    </p>
    <p>
      The dataset shown in this application includes two sets of variables
    </p>
    <ol>
      <li>
        <strong>Vulnerability Risk Scores</strong>: results of the vulnerability assessment
        scaled from 0 to 100 across the CCE and within each major basin.
      </li>
      <li>
        <strong>Covariates (Input Variables)</strong>: include species hybridization,
        demographics, presence/absence, habitat characteristics and climate exposure.
      </li>
    </ol>
    <p>
      The following sections provide more details about each set of variables.
    </p>
    <hr>
    <h3>Vulnerability Risk Scores</h3>
    <p>
      The vulnerability risk scores were developed using a conceptual climate change
      vulnerability framework that incorporates the sensitivity, exposure and adaptive capacity
      of each of the two species (Westslope Cutthroat Trout and Bull Trout). Wade et al. (2017;
      see citations list below) provide an example of this type of approach, which was further
      refined for this study using additional data and improved understanding of the underlying
      relationships.
    </p>
    <p>
      For each species, a set of vulnerability risk scores were computed for each local
      population path under four potential future scenarios (
        <a
          href="https://en.wikipedia.org/wiki/Representative_Concentration_Pathways"
          target="_blank">RCP 4.5 and 8.5 greenhouse gas concentration trajectories</a>
      for years 2035 and 2075).
      The scores are scaled from 0 to 100 (higher values = greater vulnerability) across 1) all
      patches within the CCE region, and 2) across all patches within each major basin. The
      overall risk score is based on the average across the individual scores for each component
      (i.e. Climate, Habitat, Demographic, Genetic).
    </p>
    <table class="table table-condensed table-striped" style="width:100%">
      <thead>
        <tr>
          <th class="col-md-4">Variable</th>
          <th class="col-md-6">Description</th>
          <th class="col-md-1 text-center">Westslope Cutthroat Trout</th>
          <th class="col-md-1 text-center">Bull Trout</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="col-md-4">Overall Risk</td>
          <td class="col-md-6">
            Overall risk based on the average across the individual components below.
          </td>
          <td class="col-md-1 text-center">X</td>
          <td class="col-md-1 text-center">X</td>
        </tr>
        <tr>
          <td class="col-md-4">Climate Risk</td>
          <td class="col-md-6">
            Risk associated with exposure to changes in climate.
          </td>
          <td class="col-md-1 text-center">X</td>
          <td class="col-md-1 text-center">X</td>
        </tr>
        <tr>
          <td class="col-md-4">Demographic Risk</td>
          <td class="col-md-6">
            Risk associated with the demographics of each population (Westslope Cutthroat
            Trout only).
          </td>
          <td class="col-md-1 text-center">X</td>
          <td class="col-md-1 text-center"></td>
        </tr>
        <tr>
          <td class="col-md-4">Genetic Risk</td>
          <td class="col-md-6">
            Risk associated with the genetics of each population (Westslope Cutthroat
            Trout only).
          </td>
          <td class="col-md-1 text-center">X</td>
          <td class="col-md-1 text-center"></td>
        </tr>
        <tr>
          <td class="col-md-4">Demographic/Genetic Risk</td>
          <td class="col-md-6">
            Risk associated with both the demographics and genetics of each population (Bull
            Trout only).
          </td>
          <td class="col-md-1 text-center"></td>
          <td class="col-md-1 text-center">X</td>
        </tr>
        <tr>
          <td class="col-md-4">Habitat Risk</td>
          <td class="col-md-6">
            Risk associated with habitat quantity and quality for each population.
          </td>
          <td class="col-md-1 text-center">X</td>
          <td class="col-md-1 text-center">X</td>
        </tr>
      </tbody>
    </table>
    <hr>
    <h3>Hybridization Covariates</h3>
    <table class="table table-condensed table-striped" style="width:100%">
      <thead>
        <tr>
          <th class="col-md-4">Variable</th>
          <th class="col-md-6">Description</th>
          <th class="col-md-1 text-center">Westslope Cutthroat Trout</th>
          <th class="col-md-1 text-center">Bull Trout</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="col-md-4">Hybridization Threat Index (HTI)</td>
          <td class="col-md-6">
            Hybrid Threat Index describes risk of admixture via connectivity to other admixed
            populations. HTI is calculated using a weighted (by fluvial distance) summation of
            admixture among all interconnected populations.
          </td>
          <td class="col-md-1 text-center">X</td>
          <td class="col-md-1 text-center"></td>
        </tr>
        <tr>
          <td class="col-md-4">Maximum Rainbow Trout Admixture</td>
          <td class="col-md-6">
            Maximum rainbow trout admixture (0 to 100) observed within a patch. Used also as
            component of the HTI variable.
          </td>
          <td class="col-md-1 text-center">X</td>
          <td class="col-md-1 text-center"></td>
        </tr>
      </tbody>
    </table>
    <hr>
    <h3>Demographic Covariates</h3>
    <table class="table table-condensed table-striped" style="width:100%">
      <thead>
        <tr>
          <th class="col-md-4">Variable</th>
          <th class="col-md-6">Description</th>
          <th class="col-md-1 text-center">Westslope Cutthroat Trout</th>
          <th class="col-md-1 text-center">Bull Trout</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="col-md-4">Average Abundance (2000-2017)</td>
          <td class="col-md-6">
            Average number of redds over 2000-2017 based on either 1) at least five years of
            data, or 2) model predictions using the methodology by Kovach et al. (2016).
          </td>
          <td class="col-md-1 text-center"></td>
          <td class="col-md-1 text-center">X</td>
        </tr>
        <tr>
          <td class="col-md-4">Average Abundance Based on Model Predictions</td>
          <td class="col-md-6">
            Indicates whether the Average Abundance (2000-2017) was based on model predictions
            (1) or at least five years of data (0).
          </td>
          <td class="col-md-1 text-center"></td>
          <td class="col-md-1 text-center">X</td>
        </tr>
        <tr>
          <td class="col-md-4">Invasive Species Distance Index</td>
          <td class="col-md-6">
            Composite statistic (from 0 to 6) that includes distance data for invasive brook
            trout, brown trout, and lake trout. "0" means no invasive species connected to
            population, "6" means all three species are present in the core population patch.
          </td>
          <td class="col-md-1 text-center">X</td>
          <td class="col-md-1 text-center">X</td>
        </tr>
        <tr>
          <td class="col-md-4">Isolation Status</td>
          <td class="col-md-6">
            Isolation status (1 = isolated, 0 = not isolated) of each patch based on 1) the
            presence of upstream barriers or 2) by distance and poor habitat when verified by
            biologists.
          </td>
          <td class="col-md-1 text-center">X</td>
          <td class="col-md-1 text-center">X</td>
        </tr>
        <tr>
          <td class="col-md-4">Disjunct Population Status</td>
          <td class="col-md-6">
            Disjunct population status (1 = disjunt, 0 = not disjunt) indicating whether
            population does not interact with other populations due to physical barriers, low
            population, poor migration corridor habitat, or known/assumed reproductive
            isolation. Similar to Isolation Status but includes these other factors in addition
            to physical barriers. If a population is disjunct then the Number of Connected
            Populations will also be zero.
          </td>
          <td class="col-md-1 text-center"></td>
          <td class="col-md-1 text-center">X</td>
        </tr>
        <tr>
          <td class="col-md-4">Number of Connected Populations</td>
          <td class="col-md-6">
            Number of other populations connected to each patch.
          </td>
          <td class="col-md-1 text-center">X</td>
          <td class="col-md-1 text-center">X</td>
        </tr>
      </tbody>
    </table>
    <hr>
    <h3>Presence/Absence Covariates</h3>
    <table class="table table-condensed table-striped" style="width:100%">
      <thead>
        <tr>
          <th class="col-md-4">Variable</th>
          <th class="col-md-6">Description</th>
          <th class="col-md-1 text-center">Westslope Cutthroat Trout</th>
          <th class="col-md-1 text-center">Bull Trout</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="col-md-4">Presence of Westslope Cutthroat Trout</td>
          <td class="col-md-6">
            Presence (1) or absence (0) of Westslope Cutthroat Trout within each patch.
          </td>
          <td class="col-md-1 text-center">X</td>
          <td class="col-md-1 text-center"></td>
        </tr>
        <tr>
          <td class="col-md-4">Presence of Bull Trout</td>
          <td class="col-md-6">Presence (1) or absence (0) of Bull Trout within each patch.</td>
          <td class="col-md-1 text-center">X</td>
          <td class="col-md-1 text-center"></td>
        </tr>
        <tr>
          <td class="col-md-4">Presence of Lake Trout</td>
          <td class="col-md-6">Presence (1) or absence (0) of Lake Trout within each patch.</td>
          <td class="col-md-1 text-center">X</td>
          <td class="col-md-1 text-center">X</td>
        </tr>
        <tr>
          <td class="col-md-4">Presence of Brown Trout</td>
          <td class="col-md-6">
            Presence (1) or absence (0) of Brown Trout within each patch.
          </td>
          <td class="col-md-1 text-center">X</td>
          <td class="col-md-1 text-center">X</td>
        </tr>
        <tr>
          <td class="col-md-4">Presence of Brook Trout</td>
          <td class="col-md-6">
            Presence (1) or absence (0) of Brook Trout within each patch.
          </td>
          <td class="col-md-1 text-center">X</td>
          <td class="col-md-1 text-center">X</td>
        </tr>
      </tbody>
    </table>
    <hr>
    <h3>Habitat Covariates</h3>
    <table class="table table-condensed table-striped" style="width:100%">
      <thead>
        <tr>
          <th class="col-md-4">Variable</th>
          <th class="col-md-6">Description</th>
          <th class="col-md-1 text-center">Westslope Cutthroat Trout</th>
          <th class="col-md-1 text-center">Bull Trout</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="col-md-4">Patch Area (km2)</td>
          <td class="col-md-6">Total area (sq km) of each patch.</td>
          <td class="col-md-1 text-center">X</td>
          <td class="col-md-1 text-center">X</td>
        </tr>
        <tr>
          <td class="col-md-4">Stream Length (km)</td>
          <td class="col-md-6">Total stream length (km) within each patch.</td>
          <td class="col-md-1 text-center">X</td>
          <td class="col-md-1 text-center"></td>
        </tr>
        <tr>
          <td class="col-md-4">
            Stream Length with Critical Spawning &amp; Rearing Habitat (km)
          </td>
          <td class="col-md-6">
            Total stream length (km) providing critical spawning and rearing habitat within each
            patch.
          </td>
          <td class="col-md-1 text-center"></td>
          <td class="col-md-1 text-center">X</td>
        </tr>
        <tr>
          <td class="col-md-4">Road Length per Unit Patch Area (km/km2)</td>
          <td class="col-md-6">
            Total length of roads (km) within the entire drainage area of each patch divided by
            total patch area (km2). Note that the drainage areas of some patches are larger than
            the patches themselves due to upstream barriers.
          </td>
          <td class="col-md-1 text-center">X</td>
          <td class="col-md-1 text-center">X</td>
        </tr>
        <tr>
          <td class="col-md-4">Frac. Patch Area as Valley Bottom</td>
          <td class="col-md-6">Fraction (0 to 1) of patch area representing valley bottom.</td>
          <td class="col-md-1 text-center">X</td>
          <td class="col-md-1 text-center">X</td>
        </tr>
      </tbody>
    </table>
    <hr>
    <h3>Climate Exposure Covariates</h3>
    <p>
      For each of the following variables, values are provided based on historical conditions
      (1985-2005) and four potential future scenarios
        (<a
          href="https://en.wikipedia.org/wiki/Representative_Concentration_Pathways"
          target="_blank">RCP 4.5 and 8.5 greenhouse gas concentration trajectories</a>
      for years 2035 and 2075).
    </p>
    <table class="table table-condensed table-striped" style="width:100%">
      <thead>
        <tr>
          <th class="col-md-4">Variable</th>
          <th class="col-md-6">Description</th>
          <th class="col-md-1 text-center">Westslope Cutthroat Trout</th>
          <th class="col-md-1 text-center">Bull Trout</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="col-md-4">Mean Aug. Stream Temp, degC</td>
          <td class="col-md-6">
            Average of the mean August stream temperature (degC) across all streams within each
            patch. Average is computed by weighting the mean August temperature of each stream
            segment by its length (i.e. this is a length-weighted average across all streams).
          </td>
          <td class="col-md-1 text-center">X</td>
          <td class="col-md-1 text-center"></td>
        </tr>
        <tr>
          <td class="col-md-4">Max Aug. Stream Temp, degC</td>
          <td class="col-md-6">
            Maximum of the mean August stream temperature (degC) among all streams within each
            patch.
          </td>
          <td class="col-md-1 text-center">X</td>
          <td class="col-md-1 text-center"></td>
        </tr>
        <tr>
          <td class="col-md-4">Frac. Stream Length with Mean Aug Temp > 15 degC</td>
          <td class="col-md-6">
            Fraction (0 to 1) of the total stream length with mean August temperatures exceeding
            15 degC within each patch.
          </td>
          <td class="col-md-1 text-center">X</td>
          <td class="col-md-1 text-center"></td>
        </tr>
        <tr>
          <td class="col-md-4">Frac. S/R Habitat Length with Mean Aug Temp > 15 degC</td>
          <td class="col-md-6">
            Fraction (0 to 1) of the total spawning &amp; rearing habitat length with mean
            August temperatures exceeding 15 degC within each patch.
          </td>
          <td class="col-md-1 text-center"></td>
          <td class="col-md-1 text-center">X</td>
        </tr>
        <tr>
          <td class="col-md-4">May Precipitation, mm</td>
          <td class="col-md-6">
            Average total precipitation (mm) in the month of May. Computed from continuous grids
            (i.e. rasters) using spatial averaging across each patch.
          </td>
          <td class="col-md-1 text-center">X</td>
          <td class="col-md-1 text-center"></td>
        </tr>
      </tbody>
    </table>
    <hr>
    <h3>Related Citations</h3>
    <ul>
      <li>
        Muhlfeld, C.C., R.P. Kovach, R. Al-Chokhachy and 12 co-authors. 2017 Legacy
        introductions and climatic variation explain spatiotemporal patterns of invasive
        hybridization in a native trout. Global Change Biology 2017;00:1–11.
        https://doi.org/10.1111/gcb.13681
      </li>
      <li>
        Kovach, R.P., Al-Chokhachy, R., Whited, D., Dux, A., and Schmetterling, Dux, A.M.,
        &amp; Muhlfeld, C.C. 2016 Climate, invasive species, and land-use drive population
        dynamics of a coldwater specialist. Journal of Applied Ecology.
        doi: 10.1111/1365-2664.12766
      </li>
      <li>
        Wade, A.A., Hand, B.K., Kovach, R.P., Luikart, G., Whited, D.C. &amp; Muhlfeld, C.C.
        2017 Accounting for adaptive capacity and uncertainty in assessments of species’
        climate-change vulnerability. Conservation Biology 31: 136-149.
      </li>
      <li>
        Giersch, J.J., Jordan, S., Luikart, G., Jones, L.A., Hauer, F.R. &amp; Muhlfeld, C.C.
        2015 Climate-induced range contraction of a rare alpine aquatic invertebrate. Freshwater
        Science 34: 53-65.
      </li>
      <li>
        Muhlfeld, C.C., Kovach, R.P., Jones, L.A., Al-Chokhachy, R., Boyer, M.C., Leary, R.F.,
        Lowe, W.H., Luikart, G. &amp; Allendorf, F.W. 2014 Invasive hybridization in a
        threatened species is accelerated by climate change. Nature Climate Change 4: 620-624.
      </li>
      <li>
        Hauer, F.R., Locke, H., Dreitz, V.J., Hebblewhite, M., Lowe, W.H., Muhlfeld, C.C.,
        Nelson, C.R., Proctor, M.F. &amp; Rood, S.B. 2016 Gravel-bed river floodplains are the
        ecological nexus of glaciated mountain landscapes. Science Advances 2: e1600026.
      </li>
      <li>
        Muhlfeld, C.C., D'Angelo, V.S., Downs, C., Powell, J., Amish, S., Luikart, G., Kovach,
        R., Boyer, M. &amp; Kalinowski, S. 2016 Genetic status and conservation of westslope
        cutthroat trout in Glacier National Park. Transactions of the American Fisheries Society
        145: 1093-1109.
      </li>
      <li>
        Kovach, R.P., Hand, B.K., Hohenlohe, P.A., Cosart, T.F., Boyer, M.C., Neville, H.H.,
        Muhlfeld, C.C., Amish, S.J., Carim, K., Narum, S.R., Lowe, W.H., Allendorf, F.W. &amp;
        Luikart, G. 2016 Vive la résistance: genome-wide selection against introduced alleles in
        invasive hybrid zones. Proceedings of the Royal Society B-Biological Sciences 283:
        20161380.
      </li>
      <li>
        Kovach, R.P., Muhlfeld, C.C., Wade, A.A., Hand, B.K., Whited, D.C., DeHaan, P.W.,
        Al-Chokhachy, R. &amp; Luikart, G. 2015 Genetic diversity is related to climatic
        variation and vulnerability in threatened bull trout. Global Change Biology 21:
        2510-2524.</li>
      <li>
        Kovach, R.P., Muhlfeld, C.C., Boyer, M.C., Lowe, W.H., Allendorf, F.W. &amp; Luikart, G.
        2015 Dispersal and selection mediate hybridization between a native and invasive
        species. Proceedings of the Royal Society B-Biological Sciences 282: 9.
      </li>
      <li>
        Bean, J.R., Wilcox, A.C., Woessner, W.W. &amp; Muhlfeld, C.C. 2015 Multiscale
        hydrogeomorphic influences on bull trout (Salvelinus confluentus) spawning habitat.
        Canadian Journal of Fisheries and Aquatic Sciences 72: 514-526.
      </li>
      <li>
        Muhlfeld, C.C., Kovach, R.P., Jones, L.A., Al-Chokhachy, R., Boyer, M.C., Leary, R.F.,
        Lowe, W.H., Luikart, G. &amp; Allendorf, F.W. 2014 Invasive hybridization in a
        threatened species is accelerated by climate change. Nature Climate Change 4: 620-624.
      </li>
      <li>
        Jones, L.A., Muhlfeld, C.C., Marshall, L.A., McGlynn, B.L. &amp; Kershner, J.L. 2014
        Estimating thermal regimes of bull trout and assessing the potential effects of climate
        warming on critical habitats. River Research and Applications 30: 204-216.
      </li>
      <li>
        Al-Chokhachy, R., Muhlfeld, C.C., Boyer, M.C., Jones, L.A., Steed, A. &amp; Kershner,
        J.L. 2014 Quantifying the effectiveness of conservation measures to control the spread
        of anthropogenic hybridization in stream salmonids: a climate adaptation case study.
        North American Journal of Fisheries Management 34: 642-652.
      </li>
      <li>
        Hohenlohe, P.A., Day, M.D., Amish, S.J., Miller, M.R., Kamps-Hughes, N., Boyer, M.C.,
        Muhlfeld, C.C., Allendorf, F.W., Johnson, E.A. &amp; Luikart, G. 2013 Genomic patterns
        of introgression in rainbow and westslope cutthroat trout illuminated by overlapping
        paired-end RAD sequencing. Molecular ecology 22: 3002-3013.
      </li>
      <li>
        D'Angelo, V.S. &amp; Muhlfeld, C.C. 2013 Factors Influencing the distribution of native
        bull trout and westslope cutthroat trout in streams of western Glacier National Park,
        Montana. Northwest Science 87: 1-11.
      </li>
      <li>
        Muhlfeld, C.C., McMahon, T.E., Boyer, M.C. &amp; Gresswell, R.E. 2009 Local habitat,
        watershed, and biotic factors influencing the spread of hybridization between native
        westslope cutthroat trout and introduced rainbow trout. Transactions of the American
        Fisheries Society 138: 1036-1051.
      </li>
      <li>
        Muhlfeld, C.C., McMahon, T.E., Belcer, D. &amp; Kershner, J.L. 2009 Spatial and temporal
        spawning dynamics of native westslope cutthroat trout, Oncorhynchus clarkii lewisi,
        introduced rainbow trout, Oncorhynchus mykiss, and their hybrids. Canadian Journal of
        Fisheries and Aquatic Sciences 66: 1153-1168.
      </li>
      <li>
        Muhlfeld, C.C., Kalinowski, S.T., McMahon, T.E., Taper, M.L., Painter, S., Leary, R.F.
        &amp; Allendorf, F.W. 2009 Hybridization rapidly reduces fitness of a native trout in
        the wild. Biology Letters 5: 328-331.
      </li>
      <li>
        Boyer, M.C., Muhlfeld, C.C. &amp; Allendorf, F.W. 2008 Rainbow trout (Oncorhynchus
        mykiss) invasion and the spread of hybridization with native westslope cutthroat trout
        (Oncorhynchus clarkii lewisi). Canadian Journal of Fisheries and Aquatic Sciences 65:
        658-669.
      </li>
      <li>
        Hitt, N.P., Frissell, C.A., Muhlfeld, C.C. &amp; Allendorf, F.W. 2003 Spread of
        hybridization between native westslope cutthroat trout, Oncorhynchus clarki lewisi, and
        nonnative rainbow trout, Oncorhynchus mykiss. Canadian Journal of Fisheries and Aquatic
        Sciences 60: 1440-1451.
      </li>
    </ul>
  </div>
</template>
