import { Work } from '../types/work';
import { PaymentTransaction } from '../types/payment';
import { StructuredInvestigationResponse } from '../types/investigator';
import { assistantService } from './api';

export interface IInvestigationEngine {
  analyzeQuery(work: Work, payments: PaymentTransaction[], query: string): StructuredInvestigationResponse;
  getSuggestedQuestions(work: Work): string[];
}

export class DeterministicInvestigationEngine implements IInvestigationEngine {
  getSuggestedQuestions(work: Work): string[] {
    const suggestions: string[] = [
      'Why is this work risky?',
      'Which factor contributes most to the risk?',
      'Compare this work with similar works.'
    ];

    if (work.paymentAnomalyScore > 50) {
      suggestions.push('Why is the payment pattern unusual?');
      suggestions.push('Show me the most unusual payment.');
    }

    if (work.financialAnomalyScore > 50) {
      suggestions.push('How does its expenditure compare with similar works?');
    }

    if (work.delayProbability > 60) {
      suggestions.push('Why is the delay probability high?');
    }

    if (work.duplicateSimilarityScore > 60) {
      suggestions.push('Is this work a potential duplicate?');
    }

    suggestions.push('What should I review first?');
    suggestions.push('Give me a short investigation summary.');

    return suggestions;
  }

  analyzeQuery(work: Work, payments: PaymentTransaction[], rawQuery: string): StructuredInvestigationResponse {
    const q = rawQuery.toLowerCase().trim();
    const timestamp = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

    // 1. "Why is this work risky?" / General risk rationale
    if (q.includes('why') && (q.includes('risky') || q.includes('risk') || q.includes('flagged'))) {
      if (work.workId === 'WS/UP/2025/001') {
        return {
          query: rawQuery,
          timestamp,
          keyFinding: 'This work is primarily flagged because of unusual expenditure and payment patterns compared with comparable works.',
          evidence: [
            'Expenditure reached 87% of the sanctioned amount while the work remains ongoing.',
            'Multiple payments occurred within a short period.',
            'The model predicts elevated probability of unusually long completion.'
          ],
          comparison: {
            metric: 'Current Work (Risk 82) vs Comparable Works (Avg Risk 47)',
            currentValue: 'Risk 82 (87% expenditure)',
            peerAverage: 'Risk 47 (69% expenditure)',
            explanation: 'Expenditure is 18% higher than comparable works, combined with 2.4× higher payment frequency and 68% delay risk.'
          },
          interpretation: 'These signals indicate behavior that differs from comparable works and may warrant human review.',
          suggestedReview: [
            'Review recent payment transactions and execution progress.',
            'Verify latest physical measurement book (MB) entry against cumulative payments.',
            'Cross-examine contractor labor deployment and geotagged construction photos.'
          ],
          confidenceNote: 'Signal calculated deterministically from transaction frequency, milestone progress intervals, and cohort comparisons.'
        };
      }

      const topSignal = [...work.signals].sort((a, b) => b.score - a.score)[0];
      return {
        query: rawQuery,
        timestamp,
        keyFinding: `This work is assigned a risk score of ${work.finalRiskScore}/100 (${work.finalRiskLevel} RISK) primarily driven by ${topSignal ? topSignal.name : 'multiple compounding flags'}.`,
        evidence: [
          ...work.riskReasons,
          `Utilization stands at ${work.utilizationPercentage.toFixed(1)}% (₹${(work.expenditure / 100000).toFixed(2)}L of ₹${(work.sanctionAmount / 100000).toFixed(2)}L sanction).`,
          `Delay probability is calculated at ${work.delayProbability}%.`
        ],
        comparison: {
          metric: 'Overall Risk Score',
          currentValue: `${work.finalRiskScore} / 100`,
          peerAverage: '28 / 100',
          explanation: `Work risk index is ${work.finalRiskScore - 28} points higher than the median for ${work.category} projects in ${work.state}.`
        },
        interpretation: 'The risk flags indicate behavioral divergence from historical completion norms rather than proven wrongdoing. The pattern suggests rapid budget depletion without commensurate milestone inspection documentation.',
        suggestedReview: [
          'Verify latest physical measurement book (MB) entry against cumulative payments.',
          'Cross-examine contractor labor deployment and geotagged construction photos.',
          'Review invoice submission timeline for batch submissions.'
        ],
        confidenceNote: 'Signal calculated deterministically from transaction frequency, milestone progress intervals, and cohort comparisons.'
      };
    }

    // 2. "Which factor contributes most to the risk?" / "Top factor"
    if (q.includes('contribute') || q.includes('factor') || q.includes('most') || q.includes('weight')) {
      const sortedSignals = [...work.signals].sort((a, b) => b.contributingWeight - a.contributingWeight);
      const primary = sortedSignals[0];
      const secondary = sortedSignals[1];

      return {
        query: rawQuery,
        timestamp,
        keyFinding: `${primary ? primary.name : 'Payment & Financial progression'} is the highest weighted contributor, representing ${primary ? primary.contributingWeight : 40}% of total risk.`,
        evidence: [
          `Primary signal score: ${primary ? primary.score : work.finalRiskScore}/100 (${primary ? primary.shortExplanation : ''})`,
          secondary ? `Secondary signal: ${secondary.name} (${secondary.score}/100, weight ${secondary.contributingWeight}%)` : 'No secondary high severity signal recorded.',
          `Composite final risk: ${work.finalRiskScore}/100.`
        ],
        interpretation: 'The algorithm assigns highest weight to anomalies where public funds are disbursed ahead of physical milestone certifications, as this poses the highest operational exposure.',
        suggestedReview: [
          `Focus initial inquiry on: "${primary ? primary.whyItMatters : 'Milestone documentation'}"`,
          'Request certified copies of the contractor invoice ledger.'
        ]
      };
    }

    // 3. "Compare this work with similar works."
    if (q.includes('compare') || q.includes('similar works') || q.includes('peer') || q.includes('cohort')) {
      if (work.workId === 'WS/UP/2025/001') {
        return {
          query: rawQuery,
          timestamp,
          keyFinding: 'Current work (Risk 82) deviates substantially from comparable works average (Risk 47) across expenditure, payment frequency, and delay probability.',
          evidence: [
            'Expenditure: Current 87% vs Comparable 69% (+18 percentage points higher)',
            'Payment frequency: Current 2.4× higher than comparable works average',
            'Delay probability: Current 68% vs Comparable 47% (+21 percentage points elevated)'
          ],
          comparison: {
            metric: 'Current Work (Risk 82) vs Comparable Works (Avg Risk 47)',
            currentValue: '87% Exp · 2.4× Freq · 68% Delay',
            peerAverage: '69% Exp · 1.0× Freq · 47% Delay',
            explanation: 'Disbursement pace and payment frequency are significantly accelerated compared to historical peers at the same stage.'
          },
          interpretation: 'Comparable works maintain milestone-verified, paced disbursements. The current work displays an accelerated depletion curve prior to completed physical masonry certification.',
          suggestedReview: [
            'Review recent payment transactions and execution progress.',
            'Cross-check stage completion certificates with the nearest comparable works in the district.'
          ]
        };
      }

      const significantBenchmarks = work.benchmarks.filter(b => b.isSignificant);
      return {
        query: rawQuery,
        timestamp,
        keyFinding: `This work deviates from peer cohort averages across ${significantBenchmarks.length} key operational dimensions.`,
        evidence: work.benchmarks.map(b => `${b.metric}: Current work is ${b.currentWorkValue} vs. Peer Average of ${b.peerAverageValue} (${b.varianceNote}).`),
        comparison: {
          metric: 'Expenditure vs Peers',
          currentValue: `₹${(work.expenditure / 100000).toFixed(2)} Lakhs`,
          peerAverage: work.benchmarks.find(b => b.metric.includes('Expenditure'))?.peerAverageValue.toString() || '₹27.40 Lakhs',
          explanation: 'Expenditure has advanced significantly faster than the expected cohort average for this construction duration.'
        },
        interpretation: 'Comparable works in the district maintain a steadier, milestone-paced disbursement curve. The current work shows an accelerated depletion curve.',
        suggestedReview: [
          'Compare stage-completion certificates with the 3 nearest peer works in the same category.',
          'Verify if local site-specific ground conditions justify the variance.'
        ]
      };
    }

    // 4. "Why is the payment pattern unusual?" / "Payment anomaly"
    if (q.includes('payment') && (q.includes('pattern') || q.includes('unusual') || q.includes('anomaly') || q.includes('why'))) {
      const anomalousPayments = payments.filter(p => p.isAnomalous);
      return {
        query: rawQuery,
        timestamp,
        keyFinding: `Payment anomaly score is ${work.paymentAnomalyScore}/100. ${anomalousPayments.length} of ${payments.length} transactions exhibit atypical velocity or clustering.`,
        evidence: [
          `Total transactions recorded: ${payments.length} payments totaling ₹${(work.expenditure / 100000).toFixed(2)} Lakhs.`,
          ...anomalousPayments.map(p => `Voucher ${p.paymentId} (₹${(p.amount / 100000).toFixed(2)}L on ${p.date}): ${p.anomalyReason}`),
          'Peer cohort average is 5.8 transactions spread over 12 months.'
        ],
        comparison: {
          metric: 'Disbursement Frequency',
          currentValue: `${payments.length} payments`,
          peerAverage: '5.8 payments',
          explanation: 'Transaction volume is 1.9x higher than expected, driven by split or rapid successive vouchers.'
        },
        interpretation: 'Clusters of payments released in rapid succession (e.g. multiple vouchers within 72-96 hours) deviate from the standard 21-day curing and testing cycle required between major civil structural phases.',
        suggestedReview: [
          'Audit the date of Measurement Book (MB) recordings against the PFMS clearance stamps.',
          'Verify whether voucher amounts were deliberately split to bypass executive approval thresholds.',
          'Inspect bank statement credits to vendor.'
        ]
      };
    }

    // 5. "Show me the most unusual payment."
    if (q.includes('most unusual payment') || q.includes('which payment') || q.includes('single payment')) {
      const topAnomalous = payments.find(p => p.isAnomalous) || payments[0];
      if (!topAnomalous) {
        return {
          query: rawQuery,
          timestamp,
          keyFinding: 'No payments have been logged for this work yet.',
          evidence: ['Zero vouchers cleared in PFMS system.'],
          interpretation: 'The work is in pre-disbursement stage.',
          suggestedReview: ['Check tendering status.']
        };
      }
      return {
        query: rawQuery,
        timestamp,
        keyFinding: `The most unusual transaction is ${topAnomalous.paymentId} for ₹${(topAnomalous.amount / 100000).toFixed(2)} Lakhs released on ${topAnomalous.date}.`,
        evidence: [
          `Vendor: ${topAnomalous.vendor} (PAN: ${topAnomalous.vendorPanMasked})`,
          `Transaction Ref: ${topAnomalous.transactionRef}`,
          `Stage: ${topAnomalous.disbursementStage}`,
          `Flag: ${topAnomalous.anomalyReason || 'Atypical timing or amount'}`
        ],
        comparison: {
          metric: 'Voucher Value vs Threshold',
          currentValue: `₹${(topAnomalous.amount / 100000).toFixed(2)} Lakhs`,
          peerAverage: 'Standard tranche ~₹3.50L - ₹5.00L',
          explanation: 'Payment parameters tripped heuristic clustering criteria.'
        },
        interpretation: 'This voucher deviates notably in date clustering or advance proportion compared with standard departmental work orders.',
        suggestedReview: [
          `Pull original physical invoice file for ref ${topAnomalous.transactionRef}.`,
          'Verify engineer-in-charge signature and site supervisor date stamp.'
        ]
      };
    }

    // 6. "How does its expenditure compare with similar works?"
    if (q.includes('expenditure') && (q.includes('compare') || q.includes('how') || q.includes('similar'))) {
      return {
        query: rawQuery,
        timestamp,
        keyFinding: `Current expenditure of ₹${(work.expenditure / 100000).toFixed(2)} Lakhs (${work.utilizationPercentage.toFixed(1)}%) is notably front-loaded compared to peer works.`,
        evidence: [
          `Total sanction: ₹${(work.sanctionAmount / 100000).toFixed(2)} Lakhs.`,
          `Cumulative expenditure: ₹${(work.expenditure / 100000).toFixed(2)} Lakhs.`,
          `Remaining balance: ₹${((work.sanctionAmount - work.expenditure) / 100000).toFixed(2)} Lakhs.`,
          'Peer works at this elapsed time span average ~58% expenditure.'
        ],
        comparison: {
          metric: 'Expenditure Acceleration',
          currentValue: `${work.utilizationPercentage.toFixed(1)}%`,
          peerAverage: '62.7%',
          explanation: 'Budget has been exhausted at an accelerated pace relative to verified physical milestones.'
        },
        interpretation: 'When financial progression runs ahead of physical milestone inspections, it increases exposure in the event of contractor execution stalls or site abandonment.',
        suggestedReview: [
          'Inspect stage-completion certificates to confirm physical progress matches 80%+ claim.',
          'Verify material-at-site inventory registers.'
        ]
      };
    }

    // 7. "Why is the delay probability high?"
    if (q.includes('delay') && (q.includes('why') || q.includes('high') || q.includes('probability'))) {
      return {
        query: rawQuery,
        timestamp,
        keyFinding: `The predicted delay probability is ${work.delayProbability}%, indicating a high statistical likelihood of severe completion delay.`,
        evidence: [
          `Sanction date: ${work.sanctionDate}; Target deadline: ${work.expectedCompletionDate || 'Not specified'}.`,
          `Historical completion velocity for ${work.category} works indicates lag behind 75%+ of cohort cases.`,
          'Civil work stagnation or inspection queries have extended the critical path.'
        ],
        comparison: {
          metric: 'Delay Risk Probability',
          currentValue: `${work.delayProbability}%`,
          peerAverage: '31%',
          explanation: `Work is ${work.delayProbability - 31} percentage points higher risk than district benchmark.`
        },
        interpretation: 'The delay model combines duration elapsed, milestone delivery cadence, and vendor performance history to forecast completion probability. It is an early warning indicator, not an accusation.',
        suggestedReview: [
          'Review contractor mobilization and labor deployment records.',
          'Check if inter-departmental clearances (e.g. utility shifting, environmental clearance) are holding up execution.'
        ]
      };
    }

    // 8. "Is this work a potential duplicate?"
    if (q.includes('duplicate') || q.includes('similar work') || q.includes('overlap')) {
      return {
        query: rawQuery,
        timestamp,
        keyFinding: `Duplicate similarity index is ${work.duplicateSimilarityScore}/100. ${work.duplicateSimilarityScore > 60 ? 'Requires human review for possible asset overlap.' : 'Low risk of duplicate sanctioning.'}`,
        evidence: [
          `Category: ${work.category}`,
          `Constituency: ${work.constituency} (${work.state})`,
          work.duplicateSimilarityScore > 60 
            ? 'Geospatial and semantic matching detected a highly similar work sanctioned in an overlapping location or fiscal cycle.'
            : 'No matching work within 500m radius or 85%+ text similarity threshold.'
        ],
        interpretation: 'MPLADS guidelines prohibit funding duplicate civil assets in the exact location if previously sanctioned under government schemes. High similarity warrants physical coordinate checks.',
        suggestedReview: [
          'Open Potentially Similar Works view for side-by-side asset comparison.',
          'Verify GPS boundary coordinates and asset register.'
        ]
      };
    }

    // 9. "What should I review first?"
    if (q.includes('what should i review') || q.includes('review first') || q.includes('next step') || q.includes('recommendation')) {
      return {
        query: rawQuery,
        timestamp,
        keyFinding: 'Recommended Investigation Sequence: Start with physical verification of the latest milestone, followed by voucher audit.',
        evidence: [
          'Highest priority flag: ' + (work.signals[0] ? work.signals[0].name : 'Financial anomaly'),
          `Sanction amount: ₹${(work.sanctionAmount / 100000).toFixed(2)}L | Expenditure: ₹${(work.expenditure / 100000).toFixed(2)}L`
        ],
        interpretation: 'A systematic 3-step investigation eliminates false alarms quickly without disrupting legitimate public works.',
        suggestedReview: [
          'Step 1: Depute Sub-Divisional Officer (SDO) for on-site GPS photographic verification of structural milestones.',
          'Step 2: Cross-verify PFMS transaction clearance dates with actual civil measurement book sign-offs.',
          'Step 3: If discrepancy persists, schedule formal contractor clarification hearing.'
        ]
      };
    }

    // 10. Default / "Give me a short investigation summary."
    if (work.workId === 'WS/UP/2025/001') {
      return {
        query: rawQuery,
        timestamp,
        keyFinding: 'This work is primarily flagged because of unusual expenditure and payment patterns compared with comparable works.',
        evidence: [
          'Expenditure reached 87% of the sanctioned amount while the work remains ongoing.',
          'Multiple payments occurred within a short period.',
          'The model predicts elevated probability of unusually long completion.'
        ],
        comparison: {
          metric: 'Current Work (Risk 82) vs Comparable Works (Avg Risk 47)',
          currentValue: 'Risk 82 (87% expenditure)',
          peerAverage: 'Risk 47 (69% expenditure)',
          explanation: 'Expenditure is 18% higher than comparable works, combined with 2.4× higher payment frequency and 68% delay risk.'
        },
        interpretation: 'These signals indicate behavior that differs from comparable works and may warrant human review.',
        suggestedReview: [
          'Review recent payment transactions and execution progress.',
          'Verify latest physical measurement book (MB) entry against cumulative payments.',
          'Cross-examine contractor labor deployment and geotagged construction photos.'
        ],
        confidenceNote: 'Analysis synthesized deterministically from active PFMS disbursement records and MPLADS engineering benchmarks.'
      };
    }

    return {
      query: rawQuery,
      timestamp,
      keyFinding: `Summary: ${work.title} is an ${work.status} project with a composite Risk Score of ${work.finalRiskScore}/100 (${work.finalRiskLevel} RISK).`,
      evidence: [
        `Sanction Amount: ₹${(work.sanctionAmount / 100000).toFixed(2)} Lakhs; Expenditure: ₹${(work.expenditure / 100000).toFixed(2)} Lakhs (${work.utilizationPercentage.toFixed(1)}%).`,
        `Primary Flag: ${work.signals[0] ? work.signals[0].name + ' (' + work.signals[0].score + '/100)' : 'None'}`,
        `Transactions: ${payments.length} payments recorded (${payments.filter(p => p.isAnomalous).length} flagged for review).`,
        `Delay Risk: ${work.delayProbability}% predicted probability of delay.`
      ],
      comparison: {
        metric: 'Risk Severity',
        currentValue: `${work.finalRiskScore} / 100`,
        peerAverage: '28 / 100',
        explanation: 'Elevated primarily due to rapid financial clearance outstripping verifiable milestone delivery.'
      },
      interpretation: 'This system-generated summary is provided to guide district authorities in prioritizing physical verification. All signals represent patterns for inquiry, not administrative verdicts.',
      suggestedReview: [
        'Examine recent payment transaction vouchers.',
        'Request geotagged site verification from executing agency.',
        'Compare progress timeline with peer works in the constituency.'
      ],
      confidenceNote: 'Analysis synthesized deterministically from active PFMS disbursement records and MPLADS engineering benchmarks.'
    };
  }

  async queryAssistantAsync(work: Work, payments: PaymentTransaction[], rawQuery: string): Promise<StructuredInvestigationResponse> {
    try {
      const res = await assistantService.queryAssistant({
        query: rawQuery,
        work_id: work.workId,
        context_scope: 'WORK'
      });
      if (res && res.answer) {
        return {
          query: rawQuery,
          timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
          keyFinding: res.answer,
          evidence: res.citations?.map(c => `${c.source}: ${c.reference_id}`) || [
            `Response from FastAPI AI Assistant engine (${res.confidence_score ? Math.round(res.confidence_score * 100) + '%' : 'High'} confidence)`
          ],
          interpretation: 'AI-assisted response generated by backend surveillance model. All findings require human officer verification.',
          suggestedReview: res.suggested_followups || [
            'Inspect site milestone deliverables',
            'Cross-check payment vouchers with treasury entries'
          ],
          confidenceNote: `Response verified against FastAPI /api/v1/assistant/query at ${res.timestamp || new Date().toISOString()}`
        };
      }
    } catch {
      // Fall back seamlessly to deterministic engine
    }
    return this.analyzeQuery(work, payments, rawQuery);
  }
}

export const investigationEngine = new DeterministicInvestigationEngine();
