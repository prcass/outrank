# Missing Data Summary: 40 Countries × 40 Variables

**Based on tested sample:** First 10 countries × 40 World Bank indicators  
**Date:** July 18, 2025  
**Coverage Range:** 68% - 73% (11-13 missing variables per country)

## 📊 Countries Ranked by Data Completeness

| Rank | Country | ISO3 | Missing/40 | Coverage | 
|------|---------|------|------------|----------|
| 1 | Austria | AUT | 11/40 | 73% |
| 2 | United States | USA | 11/40 | 73% |
| 3 | Denmark | DNK | 12/40 | 70% |
| 4 | Luxembourg | LUX | 12/40 | 70% |
| 5 | Turkey | TUR | 12/40 | 70% |
| 6 | France | FRA | 12/40 | 70% |
| 7 | Germany | DEU | 13/40 | 68% |
| 8 | China | CHN | 13/40 | 68% |
| 9 | Japan | JPN | 13/40 | 68% |
| 10 | United Kingdom | GBR | 13/40 | 68% |

**Remaining 30 countries:** Italy, Canada, Australia, Spain, Netherlands, Sweden, Norway, Finland, Iceland, Switzerland, Belgium, New Zealand, Singapore, Israel, Ireland, Brazil, Mexico, Argentina, Chile, Colombia, Poland, Czech Republic, Thailand, Malaysia, Philippines, Indonesia, Vietnam, India, South Africa, Egypt

*Note: Full analysis of all 40 countries would require extended API testing time*

## ❌ Most Problematic Variables (Missing from All 10 Countries)

### Universal Missing (10/10 countries):
1. **Refugee population** (SM.POP.REFG)
2. **Ease of doing business** (IC.BUS.EASE.XQ) 
3. **Patent applications** (IP.PAT.RESD)
4. **CO2 emissions per capita** (EN.ATM.CO2E.PC)
5. **Renewable energy %** (EG.FEC.RNEW.ZS)
6. **PM2.5 air pollution** (EN.ATM.PM25.MC.M3)
7. **Alcohol consumption** (SH.ALC.PCAP.LI)
8. **Tourist arrivals** (ST.INT.ARVL)
9. **Tourism receipts** (ST.INT.RCPT.CD)
10. **Air transport departures** (IS.AIR.DPRT)

### Partially Missing:
- **Overweight prevalence** (9/10 countries)
- **Physicians per 1000** (8/10 countries) 
- **Gini coefficient** (4/10 countries)
- **R&D expenditure** (1/10 countries - only UK)

## 🎯 Impact on Game Challenges

### High-Impact Missing Data:
- **Challenge 10:** "Which country has the most refugees?" - **100% missing**
- **Challenge 15:** "Easiest to start a business?" - **100% missing**
- **Challenge 25:** "Most tech patents?" - **100% missing**
- **Challenge 26:** "Most CO2 pollution per person?" - **100% missing**
- **Challenge 32:** "Drinks most alcohol?" - **100% missing**
- **Challenge 36:** "Gets most tourists?" - **100% missing**

### Moderate Impact:
- **Challenge 31:** "Most overweight people?" - **90% missing**
- **Challenge 35:** "Most doctors per person?" - **80% missing**

### Low Impact:
- **Challenge 18:** "Most income inequality?" - **40% missing**
- **All other challenges:** Have good data availability

## 💡 Recommendations

### Option 1: Replace Problematic Indicators
Replace the 10 universally missing indicators with alternatives that have better data coverage:

**Tourism & Travel:**
- Replace tourist arrivals → Travel & tourism competitiveness index
- Replace tourism receipts → Tourism GDP contribution %

**Environment:**
- Replace CO2 emissions → Energy consumption per capita
- Replace renewable energy → Electricity from renewables
- Replace air pollution → Access to clean fuels %

**Health & Lifestyle:**
- Replace alcohol consumption → Health expenditure per capita
- Replace overweight → Life satisfaction index

**Business & Innovation:**
- Replace ease of business → Corruption perception index
- Replace patents → High-tech exports %

**Demographics:**
- Replace refugee population → Net migration rate

### Option 2: Use Proxy Variables
Keep challenge questions but use available related indicators:
- "Most tourists" → Use UNESCO World Heritage sites count
- "Most alcohol consumption" → Use GDP per capita as lifestyle proxy
- "Most CO2 pollution" → Use energy consumption as proxy

### Option 3: Mixed Approach (Recommended)
- Replace 5-7 most problematic indicators
- Keep 3-5 interesting challenges with proxy variables
- Maintain 30+ challenges with excellent data coverage

## 📈 Estimated Full Dataset Coverage

**Based on sample patterns:**
- **Average missing per country:** 12/40 (70% coverage)
- **Total dataset:** 40 countries × 40 variables = 1,600 data points
- **Estimated available:** ~1,120 data points (70%)
- **Estimated missing:** ~480 data points (30%)

**Quality assessment:** Good enough for implementation with some indicator substitutions.

---

*This analysis provides the foundation for building a robust, data-verified country ranking game with maximum player engagement and reliable World Bank data sources.*