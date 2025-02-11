using System.Numerics;

namespace Portaria.Models
{
    public class PaginacaoResponse<T> where T : class
    {
        public IEnumerable<T> Dados { get; set; }
        public long TotalLinhas { get; set; }
        public int Skip { get; set; }
        public int Take { get; set; }

        public PaginacaoResponse(IEnumerable<T> dados, long totalLinhas, int skip, int take)
        {
            Dados = dados;
            TotalLinhas = totalLinhas;
            Skip = skip;
            Take = take;
        }
    }
}
