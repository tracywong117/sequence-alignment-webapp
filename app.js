new Vue({
    el: '#app',
    data() {
        return {
            seq1: 'A T G C\nC G T A',
            seq2: 'A G C T\nC T G A',
            score: null,
            showResult: false
        };
    },
    methods: {
        alignSequences() {
            const seq1Array = this.seq1.toUpperCase().split('\n').map(seq => seq.replace(/\s+/g, '').split(''));
            const seq2Array = this.seq2.toUpperCase().split('\n').map(seq => seq.replace(/\s+/g, '').split(''));
            
            if (seq1Array.length !== seq2Array.length) {
                alert('Number of sequences in each batch must match.');
                return;
            }

            this.score = this.globalAlignmentBatchNoGapPenalty(seq1Array, seq2Array);
            this.showResult = true;
        },
        globalAlignmentBatchNoGapPenalty(seqs1, seqs2, matchScore = 1, mismatchPenalty = 0) {
            const batchSize = seqs1.length;
            const maxLen = Math.max(...seqs1.map(seq => seq.length));
            const scoreMatrix = Array.from({ length: batchSize }, () =>
                Array.from({ length: maxLen + 1 }, () => Array(maxLen + 1).fill(0))
            );

            for (let b = 0; b < batchSize; b++) {
                const len1 = seqs1[b].length;
                const len2 = seqs2[b].length;

                for (let i = 1; i <= len1; i++) {
                    for (let j = 1; j <= len2; j++) {
                        const match = scoreMatrix[b][i-1][j-1] + (seqs1[b][i-1] === seqs2[b][j-1] ? matchScore : mismatchPenalty);
                        const deleteScore = scoreMatrix[b][i-1][j];
                        const insert = scoreMatrix[b][i][j-1];
                        scoreMatrix[b][i][j] = Math.max(match, deleteScore, insert);
                    }
                }
            }

            return scoreMatrix.map(matrix => matrix[maxLen][maxLen]);
        },
        resetForm() {
            this.seq1 = '';
            this.seq2 = '';
            this.score = null;
            this.showResult = false;
        }
    }
});