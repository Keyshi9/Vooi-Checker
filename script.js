const TOTAL_SUPPLY = 600000000;
const AIRDROP_PERCENTAGE = 0.075;
const COST_PER_POINT = 0.001;

const FDV_SCENARIOS = [
    { fdv: 50000000, label: 'Bearish', class: 'bearish' },
    { fdv: 112500000, label: 'Conservative', class: 'neutral' },
    { fdv: 300000000, label: 'Moderate', class: 'neutral' },
    { fdv: 500000000, label: 'Base', class: 'neutral' },
    { fdv: 1000000000, label: 'Optimistic', class: 'bullish' },
    { fdv: 2500000000, label: 'Bullish', class: 'bullish' }
];

const pointsInput = document.getElementById('pointsInput');
const resultsSection = document.getElementById('resultsSection');
const resultsBody = document.getElementById('resultsBody');
const statsSummary = document.getElementById('statsSummary');
const shareValue = document.getElementById('shareValue');
const costValue = document.getElementById('costValue');
const errorMessage = document.getElementById('error-message');
const shareBtn = document.getElementById('shareBtn');

function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
}

function calculate() {
    const points = parseFloat(pointsInput.value);

    if (isNaN(points) || points < 0) {
        if (pointsInput.value !== '') {
            errorMessage.classList.remove('hidden');
        }
        resultsSection.classList.add('hidden');
        statsSummary.classList.add('hidden');
        return;
    }

    errorMessage.classList.add('hidden');
    resultsSection.classList.remove('hidden');
    statsSummary.classList.remove('hidden');

    const userShare = points / TOTAL_SUPPLY;
    const totalCost = points * COST_PER_POINT;

    // Update Summary
    shareValue.textContent = (userShare * 100).toFixed(6) + '%';
    costValue.textContent = formatCurrency(totalCost);

    // Update Table
    resultsBody.innerHTML = '';

    FDV_SCENARIOS.forEach(scenario => {
        const allocation = scenario.fdv * AIRDROP_PERCENTAGE * userShare;
        const roi = allocation - totalCost;
        const roiClass = roi >= 0 ? 'roi-positive' : 'roi-negative';

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${formatCurrency(scenario.fdv).replace('.00', '')}</td>
            <td>${scenario.label}</td>
            <td>${formatCurrency(allocation)}</td>
            <td class="${roiClass}">${roi > 0 ? '+' : ''}${formatCurrency(roi)}</td>
        `;
        resultsBody.appendChild(row);
    });
}

pointsInput.addEventListener('input', calculate);

shareBtn.addEventListener('click', () => {
    const points = pointsInput.value;
    if (!points) return;

    const text = `I just checked my potential $VOOI airdrop allocation! 🪂\n\nCheck yours here 👇`;
    const url = "https://app.vooi.io/?r=5DLN5HL"; // Using the referral link as the shared URL or the checker URL if hosted

    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
});
